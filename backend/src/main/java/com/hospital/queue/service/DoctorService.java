package com.hospital.queue.service;

import com.hospital.queue.dto.DoctorDto;
import com.hospital.queue.exception.BadRequestException;
import com.hospital.queue.exception.ResourceNotFoundException;
import com.hospital.queue.model.Department;
import com.hospital.queue.model.Doctor;
import com.hospital.queue.model.Role;
import com.hospital.queue.model.User;
import com.hospital.queue.repository.DepartmentRepository;
import com.hospital.queue.repository.DoctorRepository;
import com.hospital.queue.repository.UserRepository;
import com.hospital.queue.util.AppConstants;
import com.hospital.queue.websocket.WebSocketMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class DoctorService {

    private static final Logger log = LoggerFactory.getLogger(DoctorService.class);

    private final DoctorRepository doctorRepository;
    private final DepartmentRepository departmentRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuditLogService auditLogService;
    private final SimpMessagingTemplate messagingTemplate;

    public DoctorService(DoctorRepository doctorRepository,
                         DepartmentRepository departmentRepository,
                         UserRepository userRepository,
                         PasswordEncoder passwordEncoder,
                         AuditLogService auditLogService,
                         SimpMessagingTemplate messagingTemplate) {
        this.doctorRepository = doctorRepository;
        this.departmentRepository = departmentRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.auditLogService = auditLogService;
        this.messagingTemplate = messagingTemplate;
    }

    public List<DoctorDto> getAllDoctors(String departmentId, Boolean activeOnly) {
        List<Doctor> list;
        if (departmentId != null && !departmentId.isBlank()) {
            list = (activeOnly != null && activeOnly)
                    ? doctorRepository.findByDepartmentIdAndActiveTrue(departmentId)
                    : doctorRepository.findByDepartmentId(departmentId);
        } else {
            list = (activeOnly != null && activeOnly)
                    ? doctorRepository.findByActiveTrue()
                    : doctorRepository.findAll();
        }

        return list.stream().map(this::mapToDto).collect(Collectors.toList());
    }

    public DoctorDto getDoctorById(String id) {
        Doctor doctor = doctorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor", "id", id));
        return mapToDto(doctor);
    }

    public DoctorDto getDoctorByUserId(String userId) {
        Doctor doctor = doctorRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor", "userId", userId));
        return mapToDto(doctor);
    }

    public DoctorDto createDoctor(DoctorDto dto, String adminUserId, String adminEmail, String ipAddress) {
        Department dept = departmentRepository.findById(dto.getDepartmentId())
                .orElseThrow(() -> new BadRequestException("Invalid department ID: " + dto.getDepartmentId()));

        String email = dto.getEmail() != null ? dto.getEmail().toLowerCase().trim() : null;
        if (email == null || email.isBlank()) {
            throw new BadRequestException("Doctor email is required");
        }

        if (userRepository.existsByEmail(email)) {
            throw new BadRequestException("User email already exists: " + email);
        }

        // Create user account for doctor
        String rawPassword = dto.getPassword() != null && !dto.getPassword().isBlank() ? dto.getPassword() : "Doctor@123";
        User user = User.builder()
                .email(email)
                .password(passwordEncoder.encode(rawPassword))
                .fullName(dto.getFullName())
                .phoneNumber(dto.getPhoneNumber())
                .role(Role.DOCTOR)
                .active(true)
                .createdAt(Instant.now())
                .updatedAt(Instant.now())
                .build();

        User savedUser = userRepository.save(user);

        Doctor doctor = Doctor.builder()
                .userId(savedUser.getId())
                .fullName(dto.getFullName())
                .email(savedUser.getEmail())
                .phoneNumber(dto.getPhoneNumber())
                .departmentId(dept.getId())
                .departmentName(dept.getName())
                .departmentCode(dept.getCode())
                .specialization(dto.getSpecialization())
                .qualification(dto.getQualification())
                .roomNumber(dto.getRoomNumber() != null ? dto.getRoomNumber() : "Room 101")
                .experienceYears(dto.getExperienceYears())
                .consultationDurationMinutes(dto.getConsultationDurationMinutes() != null ? dto.getConsultationDurationMinutes() : 10)
                .availableDays(dto.getAvailableDays() != null ? dto.getAvailableDays() : List.of("MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"))
                .timeSlots(dto.getTimeSlots() != null ? dto.getTimeSlots() : List.of("09:00 - 10:00", "10:00 - 11:00", "11:00 - 12:00", "14:00 - 15:00", "15:00 - 16:00", "16:00 - 17:00"))
                .availabilityStatus("AVAILABLE")
                .active(true)
                .createdAt(Instant.now())
                .updatedAt(Instant.now())
                .build();

        Doctor savedDoctor = doctorRepository.save(doctor);

        auditLogService.log(
                adminUserId,
                adminEmail,
                "ADMIN",
                "DOCTOR_CREATED",
                "Doctor",
                savedDoctor.getId(),
                "Added doctor Dr. " + savedDoctor.getFullName() + " to " + dept.getName(),
                ipAddress
        );

        return mapToDto(savedDoctor);
    }

    public DoctorDto updateDoctor(String id, DoctorDto dto, String currentUserId, String userRole, String userEmail, String ipAddress) {
        Doctor doctor = doctorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor", "id", id));

        if (dto.getDepartmentId() != null && !dto.getDepartmentId().equals(doctor.getDepartmentId())) {
            Department dept = departmentRepository.findById(dto.getDepartmentId())
                    .orElseThrow(() -> new BadRequestException("Invalid department ID: " + dto.getDepartmentId()));
            doctor.setDepartmentId(dept.getId());
            doctor.setDepartmentName(dept.getName());
            doctor.setDepartmentCode(dept.getCode());
        }

        if (dto.getFullName() != null) doctor.setFullName(dto.getFullName());
        if (dto.getPhoneNumber() != null) doctor.setPhoneNumber(dto.getPhoneNumber());
        if (dto.getSpecialization() != null) doctor.setSpecialization(dto.getSpecialization());
        if (dto.getQualification() != null) doctor.setQualification(dto.getQualification());
        if (dto.getRoomNumber() != null) doctor.setRoomNumber(dto.getRoomNumber());
        if (dto.getExperienceYears() != null) doctor.setExperienceYears(dto.getExperienceYears());
        if (dto.getConsultationDurationMinutes() != null) doctor.setConsultationDurationMinutes(dto.getConsultationDurationMinutes());
        if (dto.getAvailableDays() != null) doctor.setAvailableDays(dto.getAvailableDays());
        if (dto.getTimeSlots() != null) doctor.setTimeSlots(dto.getTimeSlots());
        if (dto.getAvailabilityStatus() != null) doctor.setAvailabilityStatus(dto.getAvailabilityStatus());
        doctor.setActive(dto.isActive());
        doctor.setUpdatedAt(Instant.now());

        Doctor updated = doctorRepository.save(doctor);

        // Update corresponding User record
        userRepository.findById(doctor.getUserId()).ifPresent(u -> {
            if (dto.getFullName() != null) u.setFullName(dto.getFullName());
            if (dto.getPhoneNumber() != null) u.setPhoneNumber(dto.getPhoneNumber());
            u.setActive(dto.isActive());
            u.setUpdatedAt(Instant.now());
            userRepository.save(u);
        });

        // Broadcast doctor status change
        broadcastDoctorStatusChange(updated);

        auditLogService.log(
                currentUserId,
                userEmail,
                userRole,
                "DOCTOR_UPDATED",
                "Doctor",
                updated.getId(),
                "Updated doctor Dr. " + updated.getFullName(),
                ipAddress
        );

        return mapToDto(updated);
    }

    public DoctorDto updateAvailability(String doctorId, String status, String userId, String email, String ipAddress) {
        Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor", "id", doctorId));

        doctor.setAvailabilityStatus(status);
        doctor.setUpdatedAt(Instant.now());
        Doctor saved = doctorRepository.save(doctor);

        broadcastDoctorStatusChange(saved);

        auditLogService.log(
                userId,
                email,
                "DOCTOR",
                "DOCTOR_AVAILABILITY_CHANGED",
                "Doctor",
                saved.getId(),
                "Changed status to " + status,
                ipAddress
        );

        return mapToDto(saved);
    }

    public void deleteDoctor(String id, String adminUserId, String adminEmail, String ipAddress) {
        Doctor doctor = doctorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor", "id", id));

        doctor.setActive(false);
        doctor.setUpdatedAt(Instant.now());
        doctorRepository.save(doctor);

        userRepository.findById(doctor.getUserId()).ifPresent(u -> {
            u.setActive(false);
            userRepository.save(u);
        });

        broadcastDoctorStatusChange(doctor);

        auditLogService.log(
                adminUserId,
                adminEmail,
                "ADMIN",
                "DOCTOR_DEACTIVATED",
                "Doctor",
                doctor.getId(),
                "Deactivated doctor Dr. " + doctor.getFullName(),
                ipAddress
        );
    }

    private void broadcastDoctorStatusChange(Doctor doctor) {
        try {
            WebSocketMessage<DoctorDto> wsMsg = WebSocketMessage.<DoctorDto>builder()
                    .type(AppConstants.EVENT_DOCTOR_STATUS_CHANGED)
                    .doctorId(doctor.getId())
                    .departmentId(doctor.getDepartmentId())
                    .roomNumber(doctor.getRoomNumber())
                    .message("Doctor " + doctor.getFullName() + " is now " + doctor.getAvailabilityStatus())
                    .payload(mapToDto(doctor))
                    .timestamp(Instant.now())
                    .build();

            messagingTemplate.convertAndSend(AppConstants.TOPIC_QUEUE_DEPARTMENT + doctor.getDepartmentId(), wsMsg);
            messagingTemplate.convertAndSend(AppConstants.TOPIC_PUBLIC_DISPLAY, wsMsg);
        } catch (Exception e) {
            log.warn("Failed to broadcast doctor status change: {}", e.getMessage());
        }
    }

    public DoctorDto mapToDto(Doctor doctor) {
        return DoctorDto.builder()
                .id(doctor.getId())
                .userId(doctor.getUserId())
                .fullName(doctor.getFullName())
                .email(doctor.getEmail())
                .phoneNumber(doctor.getPhoneNumber())
                .departmentId(doctor.getDepartmentId())
                .departmentName(doctor.getDepartmentName())
                .departmentCode(doctor.getDepartmentCode())
                .specialization(doctor.getSpecialization())
                .qualification(doctor.getQualification())
                .roomNumber(doctor.getRoomNumber())
                .experienceYears(doctor.getExperienceYears())
                .consultationDurationMinutes(doctor.getConsultationDurationMinutes())
                .availableDays(doctor.getAvailableDays())
                .timeSlots(doctor.getTimeSlots())
                .availabilityStatus(doctor.getAvailabilityStatus())
                .active(doctor.isActive())
                .createdAt(doctor.getCreatedAt())
                .build();
    }
}
