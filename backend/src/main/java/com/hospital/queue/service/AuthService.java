package com.hospital.queue.service;

import com.hospital.queue.dto.AuthRequest;
import com.hospital.queue.dto.AuthResponse;
import com.hospital.queue.dto.RegisterRequest;
import com.hospital.queue.dto.UserDto;
import com.hospital.queue.exception.BadRequestException;
import com.hospital.queue.exception.ResourceNotFoundException;
import com.hospital.queue.model.Doctor;
import com.hospital.queue.model.Role;
import com.hospital.queue.model.User;
import com.hospital.queue.repository.DepartmentRepository;
import com.hospital.queue.repository.DoctorRepository;
import com.hospital.queue.repository.UserRepository;
import com.hospital.queue.security.JwtTokenProvider;
import com.hospital.queue.security.UserPrincipal;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Optional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final DoctorRepository doctorRepository;
    private final DepartmentRepository departmentRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;
    private final AuditLogService auditLogService;

    public AuthService(UserRepository userRepository,
                       DoctorRepository doctorRepository,
                       DepartmentRepository departmentRepository,
                       PasswordEncoder passwordEncoder,
                       AuthenticationManager authenticationManager,
                       JwtTokenProvider tokenProvider,
                       AuditLogService auditLogService) {
        this.userRepository = userRepository;
        this.doctorRepository = doctorRepository;
        this.departmentRepository = departmentRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.tokenProvider = tokenProvider;
        this.auditLogService = auditLogService;
    }

    public AuthResponse register(RegisterRequest request, String ipAddress) {
        if (userRepository.existsByEmail(request.getEmail().toLowerCase().trim())) {
            throw new BadRequestException("Email address is already in use: " + request.getEmail());
        }

        Role assignedRole = request.getRole() != null ? request.getRole() : Role.PATIENT;

        User user = User.builder()
                .email(request.getEmail().toLowerCase().trim())
                .password(passwordEncoder.encode(request.getPassword()))
                .fullName(request.getFullName())
                .phoneNumber(request.getPhoneNumber())
                .role(assignedRole)
                .active(true)
                .age(request.getAge())
                .gender(request.getGender())
                .bloodGroup(request.getBloodGroup())
                .address(request.getAddress())
                .emergencyContact(request.getEmergencyContact())
                .createdAt(Instant.now())
                .updatedAt(Instant.now())
                .build();

        User savedUser = userRepository.save(user);

        // If registered as DOCTOR, create Doctor profile
        Doctor savedDoctor = null;
        if (assignedRole == Role.DOCTOR && request.getDepartmentId() != null) {
            var dept = departmentRepository.findById(request.getDepartmentId())
                    .orElseThrow(() -> new BadRequestException("Invalid department ID: " + request.getDepartmentId()));

            Doctor doctor = Doctor.builder()
                    .userId(savedUser.getId())
                    .fullName(savedUser.getFullName())
                    .email(savedUser.getEmail())
                    .phoneNumber(savedUser.getPhoneNumber())
                    .departmentId(dept.getId())
                    .departmentName(dept.getName())
                    .departmentCode(dept.getCode())
                    .specialization(request.getSpecialization())
                    .qualification(request.getQualification())
                    .roomNumber(request.getRoomNumber() != null ? request.getRoomNumber() : "Room 101")
                    .consultationDurationMinutes(request.getConsultationDurationMinutes() != null ? request.getConsultationDurationMinutes() : 10)
                    .availabilityStatus("AVAILABLE")
                    .active(true)
                    .createdAt(Instant.now())
                    .updatedAt(Instant.now())
                    .build();

            savedDoctor = doctorRepository.save(doctor);
        }

        // Generate JWT
        String token = tokenProvider.generateTokenFromUserId(
                savedUser.getId(),
                savedUser.getEmail(),
                savedUser.getRole().name(),
                savedUser.getFullName()
        );

        auditLogService.log(
                savedUser.getId(),
                savedUser.getEmail(),
                savedUser.getRole().name(),
                "USER_REGISTERED",
                "User",
                savedUser.getId(),
                "User registered with role " + savedUser.getRole().name(),
                ipAddress
        );

        return buildAuthResponse(savedUser, savedDoctor, token);
    }

    public AuthResponse login(AuthRequest request, String ipAddress) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail().toLowerCase().trim(),
                        request.getPassword()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String token = tokenProvider.generateToken(authentication);

        UserPrincipal principal = (UserPrincipal) authentication.getPrincipal();
        User user = userRepository.findById(principal.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", principal.getId()));

        Doctor doctor = null;
        if (user.getRole() == Role.DOCTOR) {
            doctor = doctorRepository.findByUserId(user.getId()).orElse(null);
        }

        auditLogService.log(
                user.getId(),
                user.getEmail(),
                user.getRole().name(),
                "USER_LOGIN",
                "User",
                user.getId(),
                "User successfully logged in",
                ipAddress
        );

        return buildAuthResponse(user, doctor, token);
    }

    public UserDto getCurrentUserProfile(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        return mapToUserDto(user);
    }

    public UserDto updateProfile(String userId, UserDto dto) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        if (dto.getFullName() != null) user.setFullName(dto.getFullName());
        if (dto.getPhoneNumber() != null) user.setPhoneNumber(dto.getPhoneNumber());
        if (dto.getAge() != null) user.setAge(dto.getAge());
        if (dto.getGender() != null) user.setGender(dto.getGender());
        if (dto.getBloodGroup() != null) user.setBloodGroup(dto.getBloodGroup());
        if (dto.getAddress() != null) user.setAddress(dto.getAddress());
        if (dto.getEmergencyContact() != null) user.setEmergencyContact(dto.getEmergencyContact());
        user.setUpdatedAt(Instant.now());

        User updated = userRepository.save(user);

        // If user is a doctor, update Doctor model as well
        if (user.getRole() == Role.DOCTOR) {
            doctorRepository.findByUserId(user.getId()).ifPresent(doc -> {
                doc.setFullName(updated.getFullName());
                doc.setPhoneNumber(updated.getPhoneNumber());
                doc.setUpdatedAt(Instant.now());
                doctorRepository.save(doc);
            });
        }

        return mapToUserDto(updated);
    }

    private AuthResponse buildAuthResponse(User user, Doctor doctor, String token) {
        AuthResponse.Builder builder = AuthResponse.builder()
                .token(token)
                .type("Bearer")
                .id(user.getId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .phoneNumber(user.getPhoneNumber())
                .role(user.getRole())
                .age(user.getAge())
                .gender(user.getGender())
                .bloodGroup(user.getBloodGroup())
                .emergencyContact(user.getEmergencyContact());

        if (doctor != null) {
            builder.doctorId(doctor.getId())
                    .departmentId(doctor.getDepartmentId())
                    .departmentName(doctor.getDepartmentName())
                    .roomNumber(doctor.getRoomNumber());
        }

        return builder.build();
    }

    public UserDto mapToUserDto(User user) {
        return UserDto.builder()
                .id(user.getId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .phoneNumber(user.getPhoneNumber())
                .role(user.getRole())
                .active(user.isActive())
                .age(user.getAge())
                .gender(user.getGender())
                .bloodGroup(user.getBloodGroup())
                .address(user.getAddress())
                .emergencyContact(user.getEmergencyContact())
                .createdAt(user.getCreatedAt())
                .build();
    }
}
