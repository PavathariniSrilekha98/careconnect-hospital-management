package com.hospital.queue.service;

import com.hospital.queue.dto.AppointmentRequestDto;
import com.hospital.queue.dto.AppointmentResponseDto;
import com.hospital.queue.dto.CheckInRequestDto;
import com.hospital.queue.exception.BadRequestException;
import com.hospital.queue.exception.ResourceNotFoundException;
import com.hospital.queue.model.*;
import com.hospital.queue.repository.*;
import com.hospital.queue.service.QrCodeService.QrResult;
import com.hospital.queue.service.TokenGeneratorService.TokenResult;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.Locale;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class AppointmentService {

    private static final Logger log = LoggerFactory.getLogger(AppointmentService.class);

    private final AppointmentRepository appointmentRepository;
    private final DepartmentRepository departmentRepository;
    private final DoctorRepository doctorRepository;
    private final UserRepository userRepository;
    private final QueueTicketRepository queueTicketRepository;
    private final TokenGeneratorService tokenGeneratorService;
    private final QrCodeService qrCodeService;
    private final QueueService queueService;
    private final NotificationService notificationService;
    private final AuditLogService auditLogService;

    public AppointmentService(AppointmentRepository appointmentRepository,
                              DepartmentRepository departmentRepository,
                              DoctorRepository doctorRepository,
                              UserRepository userRepository,
                              QueueTicketRepository queueTicketRepository,
                              TokenGeneratorService tokenGeneratorService,
                              QrCodeService qrCodeService,
                              QueueService queueService,
                              NotificationService notificationService,
                              AuditLogService auditLogService) {
        this.appointmentRepository = appointmentRepository;
        this.departmentRepository = departmentRepository;
        this.doctorRepository = doctorRepository;
        this.userRepository = userRepository;
        this.queueTicketRepository = queueTicketRepository;
        this.tokenGeneratorService = tokenGeneratorService;
        this.qrCodeService = qrCodeService;
        this.queueService = queueService;
        this.notificationService = notificationService;
        this.auditLogService = auditLogService;
    }

    public AppointmentResponseDto bookAppointment(AppointmentRequestDto request, String patientUserId, String ipAddress) {
        User patient = userRepository.findById(patientUserId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", patientUserId));

        Department department = departmentRepository.findById(request.getDepartmentId())
                .orElseThrow(() -> new BadRequestException("Invalid department ID: " + request.getDepartmentId()));

        Doctor doctor = doctorRepository.findById(request.getDoctorId())
                .orElseThrow(() -> new BadRequestException("Invalid doctor ID: " + request.getDoctorId()));

        if (!doctor.getDepartmentId().equals(department.getId())) {
            throw new BadRequestException("Doctor does not belong to the selected department");
        }

        LocalDate today = LocalDate.now();
        LocalTime now = LocalTime.now();

        PriorityLevel priority = request.getPriority() != null ? request.getPriority() : PriorityLevel.NORMAL;
        boolean isEmergency = (priority == PriorityLevel.EMERGENCY);

        // 1. Rule: Same-day booking cut-off after 9:00 PM (Emergency cases are exempt)
        if (request.getAppointmentDate().equals(today)) {
            if (!isEmergency && now.isAfter(LocalTime.of(21, 0))) {
                throw new BadRequestException("Today's OPD registrations closed at 9:00 PM. Please book your appointment for tomorrow or select Emergency Priority.");
            }

            // 2. Rule: Prevent booking time slots that have already passed today (Emergency cases can book immediate triage)
            LocalTime slotStartTime = parseSlotStartTime(request.getTimeSlot());
            if (!isEmergency && slotStartTime != null && now.isAfter(slotStartTime)) {
                throw new BadRequestException("The time slot '" + request.getTimeSlot() + "' has already passed for today. Please choose an upcoming time slot or select tomorrow.");
            }
        } else if (request.getAppointmentDate().isBefore(today)) {
            throw new BadRequestException("Cannot book appointments for past dates.");
        }

        // 3. Rule: Slot Conflict / First-Come First-Served validation per doctor (Emergency triage bypasses standard slot capacity)
        if (!isEmergency) {
            boolean slotAlreadyBooked = appointmentRepository.existsByDoctorIdAndAppointmentDateAndTimeSlotAndStatusNot(
                    doctor.getId(),
                    request.getAppointmentDate(),
                    request.getTimeSlot(),
                    AppointmentStatus.CANCELLED
            );

            if (slotAlreadyBooked) {
                throw new BadRequestException("The time slot '" + request.getTimeSlot() + "' with Dr. " + doctor.getFullName() +
                        " on " + request.getAppointmentDate() + " is already booked by another patient. Please select another timing.");
            }
        }

        // Generate unique daily token for this department and date
        TokenResult tokenResult = tokenGeneratorService.generateToken(
                department.getCode(),
                department.getId(),
                request.getAppointmentDate()
        );

        Appointment appointment = Appointment.builder()
                .patientId(patient.getId())
                .patientName(patient.getFullName())
                .patientEmail(patient.getEmail())
                .patientPhone(patient.getPhoneNumber())
                .patientAge(patient.getAge())
                .patientGender(patient.getGender())
                .doctorId(doctor.getId())
                .doctorName(doctor.getFullName())
                .doctorSpecialization(doctor.getSpecialization())
                .doctorRoom(doctor.getRoomNumber())
                .departmentId(department.getId())
                .departmentName(department.getName())
                .departmentCode(department.getCode())
                .appointmentDate(request.getAppointmentDate())
                .timeSlot(request.getTimeSlot())
                .tokenNumber(tokenResult.tokenNumber())
                .tokenSequence(tokenResult.sequence())
                .priority(priority)
                .status(AppointmentStatus.BOOKED)
                .checkedIn(false)
                .notes(request.getNotes())
                .createdAt(Instant.now())
                .updatedAt(Instant.now())
                .build();

        // Generate QR Code with signed payload
        QrResult qr = qrCodeService.generateAppointmentQr(appointment);
        appointment.setQrCodeData(qr.qrCodeData());
        appointment.setQrCodeImageBase64(qr.qrCodeImageBase64());

        Appointment savedAppointment = appointmentRepository.save(appointment);

        // If the appointment is booked for TODAY or is an EMERGENCY, auto-enter the queue immediately
        if (request.getAppointmentDate().equals(LocalDate.now()) || isEmergency) {
            queueService.createQueueTicketForAppointment(savedAppointment);
        }

        // Send confirmation notification to patient
        String patientMsg = isEmergency 
                ? "🚨 EMERGENCY BOOKING CONFIRMED: Token " + savedAppointment.getTokenNumber() + ". You are placed next in line right after the patient currently inside Room " + doctor.getRoomNumber() + " with Dr. " + doctor.getFullName() + "."
                : "Your appointment with Dr. " + doctor.getFullName() + " is confirmed for " + savedAppointment.getAppointmentDate() + " at slot " + savedAppointment.getTimeSlot() + ". Your Token is " + savedAppointment.getTokenNumber() + ".";

        notificationService.createAndSendNotification(
                patient.getId(),
                isEmergency ? "🚨 Emergency Priority Escalated: Token " + savedAppointment.getTokenNumber() : "Appointment Confirmed: Token " + savedAppointment.getTokenNumber(),
                patientMsg,
                isEmergency ? "EMERGENCY_ESCALATION" : "APPOINTMENT_CONFIRMED",
                savedAppointment.getId(),
                savedAppointment.getTokenNumber(),
                doctor.getRoomNumber()
        );

        // If Emergency, also notify the Doctor immediately
        if (isEmergency && doctor.getUserId() != null) {
            notificationService.createAndSendNotification(
                    doctor.getUserId(),
                    "🚨 EMERGENCY PATIENT ALERT: Token " + savedAppointment.getTokenNumber(),
                    "Emergency Patient " + patient.getFullName() + " (Token: " + savedAppointment.getTokenNumber() + ") has been queued next in line for your room (" + doctor.getRoomNumber() + ").",
                    "EMERGENCY_ALERT",
                    savedAppointment.getId(),
                    savedAppointment.getTokenNumber(),
                    doctor.getRoomNumber()
            );
        }

        auditLogService.log(
                patient.getId(),
                patient.getEmail(),
                patient.getRole().name(),
                "APPOINTMENT_BOOKED",
                "Appointment",
                savedAppointment.getId(),
                "Booked appointment with Dr. " + doctor.getFullName() + " (Token: " + savedAppointment.getTokenNumber() + ")",
                ipAddress
        );

        return enrichAndMapAppointment(savedAppointment);
    }

    public List<AppointmentResponseDto> getMyAppointments(String patientUserId) {
        List<Appointment> list = appointmentRepository.findByPatientIdOrderByAppointmentDateDesc(patientUserId);
        return list.stream().map(this::enrichAndMapAppointment).collect(Collectors.toList());
    }

    public List<AppointmentResponseDto> getDoctorAppointments(String doctorId, LocalDate date) {
        LocalDate targetDate = (date != null) ? date : LocalDate.now();
        List<Appointment> list = appointmentRepository.findByDoctorIdAndAppointmentDateOrderByTokenSequenceAsc(doctorId, targetDate);
        return list.stream().map(this::enrichAndMapAppointment).collect(Collectors.toList());
    }

    public List<AppointmentResponseDto> getAllAppointments(LocalDate date) {
        List<Appointment> list = (date != null)
                ? appointmentRepository.findByAppointmentDate(date)
                : appointmentRepository.findAll();
        return list.stream().map(this::enrichAndMapAppointment).collect(Collectors.toList());
    }

    public AppointmentResponseDto getAppointmentById(String id) {
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment", "id", id));
        return enrichAndMapAppointment(appointment);
    }

    public AppointmentResponseDto cancelAppointment(String id, String currentUserId, String userRole, String userEmail, String ipAddress) {
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment", "id", id));

        if (userRole.equals("PATIENT") && !appointment.getPatientId().equals(currentUserId)) {
            throw new BadRequestException("You are not authorized to cancel this appointment");
        }

        if (appointment.getStatus() == AppointmentStatus.COMPLETED) {
            throw new BadRequestException("Cannot cancel an already completed appointment");
        }

        appointment.setStatus(AppointmentStatus.CANCELLED);
        appointment.setUpdatedAt(Instant.now());
        Appointment saved = appointmentRepository.save(appointment);

        // Cancel corresponding queue ticket if exists
        queueTicketRepository.findByAppointmentId(id).ifPresent(ticket -> {
            ticket.setStatus(QueueStatus.SKIPPED);
            ticket.setUpdatedAt(Instant.now());
            queueTicketRepository.save(ticket);
            queueService.broadcastQueueUpdate(ticket.getDepartmentId(), ticket.getDoctorId());
        });

        notificationService.createAndSendNotification(
                appointment.getPatientId(),
                "Appointment Cancelled",
                "Your appointment (Token: " + appointment.getTokenNumber() + ") on " + appointment.getAppointmentDate() + " has been cancelled.",
                "APPOINTMENT_CANCELLED",
                appointment.getId(),
                appointment.getTokenNumber(),
                appointment.getDoctorRoom()
        );

        auditLogService.log(
                currentUserId,
                userEmail,
                userRole,
                "APPOINTMENT_CANCELLED",
                "Appointment",
                saved.getId(),
                "Cancelled appointment (Token: " + saved.getTokenNumber() + ")",
                ipAddress
        );

        return enrichAndMapAppointment(saved);
    }

    public AppointmentResponseDto rescheduleAppointment(String id, LocalDate newDate, String newSlot, String currentUserId, String userRole, String userEmail, String ipAddress) {
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment", "id", id));

        if (userRole.equals("PATIENT") && !appointment.getPatientId().equals(currentUserId)) {
            throw new BadRequestException("You are not authorized to reschedule this appointment");
        }

        // Generate fresh token for new date
        TokenResult newToken = tokenGeneratorService.generateToken(
                appointment.getDepartmentCode(),
                appointment.getDepartmentId(),
                newDate
        );

        appointment.setAppointmentDate(newDate);
        appointment.setTimeSlot(newSlot);
        appointment.setTokenNumber(newToken.tokenNumber());
        appointment.setTokenSequence(newToken.sequence());
        appointment.setStatus(AppointmentStatus.BOOKED);
        appointment.setCheckedIn(false);
        appointment.setCheckedInTime(null);
        appointment.setUpdatedAt(Instant.now());

        QrResult qr = qrCodeService.generateAppointmentQr(appointment);
        appointment.setQrCodeData(qr.qrCodeData());
        appointment.setQrCodeImageBase64(qr.qrCodeImageBase64());

        Appointment saved = appointmentRepository.save(appointment);

        // Reset or remove old queue ticket
        queueTicketRepository.findByAppointmentId(id).ifPresent(queueTicketRepository::delete);

        notificationService.createAndSendNotification(
                saved.getPatientId(),
                "Appointment Rescheduled: Token " + saved.getTokenNumber(),
                "Your appointment has been rescheduled to " + newDate + " (" + newSlot + "). New Token: " + saved.getTokenNumber(),
                "APPOINTMENT_RESCHEDULED",
                saved.getId(),
                saved.getTokenNumber(),
                saved.getDoctorRoom()
        );

        auditLogService.log(
                currentUserId,
                userEmail,
                userRole,
                "APPOINTMENT_RESCHEDULED",
                "Appointment",
                saved.getId(),
                "Rescheduled appointment to " + newDate + " (New Token: " + saved.getTokenNumber() + ")",
                ipAddress
        );

        return enrichAndMapAppointment(saved);
    }

    public AppointmentResponseDto checkInViaQr(CheckInRequestDto request, String ipAddress) {
        String qrData = request.getQrCodeData().trim();

        // Search appointment by qrCodeData or tokenNumber or ID
        Optional<Appointment> optApp = appointmentRepository.findByQrCodeData(qrData);

        if (optApp.isEmpty() && qrData.startsWith("HQMS:")) {
            String[] parts = qrData.split(":");
            if (parts.length >= 2) {
                String appointmentId = parts[1];
                optApp = appointmentRepository.findById(appointmentId);
            }
        }

        if (optApp.isEmpty()) {
            // Try match by token number for today
            optApp = appointmentRepository.findByTokenNumberAndAppointmentDate(qrData, LocalDate.now());
        }

        if (optApp.isEmpty()) {
            // Try by ID directly
            optApp = appointmentRepository.findById(qrData);
        }

        if (optApp.isEmpty()) {
            throw new ResourceNotFoundException("Invalid QR code or Token identifier: " + qrData);
        }

        Appointment appointment = optApp.get();

        if (appointment.getStatus() == AppointmentStatus.CANCELLED) {
            throw new BadRequestException("This appointment was cancelled and cannot be checked in.");
        }

        if (appointment.getStatus() == AppointmentStatus.COMPLETED) {
            throw new BadRequestException("This appointment has already been completed.");
        }

        // Activate into live queue
        QueueTicket ticket = queueService.createQueueTicketForAppointment(appointment);

        auditLogService.log(
                appointment.getPatientId(),
                appointment.getPatientEmail(),
                "PATIENT",
                "QR_CHECK_IN_COMPLETED",
                "Appointment",
                appointment.getId(),
                "Completed QR Check-In for Token " + appointment.getTokenNumber(),
                ipAddress
        );

        return enrichAndMapAppointment(appointment);
    }

    public AppointmentResponseDto enrichAndMapAppointment(Appointment app) {
        Integer currentLiveTokenSeq = null;
        String currentLiveTokenNum = null;
        Integer patientsAhead = null;
        Integer estimatedWaitMin = null;

        if (app.getAppointmentDate().equals(LocalDate.now())) {
            List<QueueTicket> doctorQueue = queueTicketRepository
                    .findByDoctorIdAndQueueDateOrderByPriorityScoreDescTokenSequenceAsc(app.getDoctorId(), LocalDate.now());

            // Currently serving
            Optional<QueueTicket> serving = doctorQueue.stream()
                    .filter(t -> t.getStatus() == QueueStatus.CALLED || t.getStatus() == QueueStatus.IN_CONSULTATION)
                    .findFirst();

            if (serving.isPresent()) {
                currentLiveTokenSeq = serving.get().getTokenSequence();
                currentLiveTokenNum = serving.get().getTokenNumber();
            }

            // Find this appointment's queue position if WAITING
            List<QueueTicket> waitingQueue = doctorQueue.stream()
                    .filter(t -> t.getStatus() == QueueStatus.WAITING)
                    .collect(Collectors.toList());

            for (int i = 0; i < waitingQueue.size(); i++) {
                QueueTicket t = waitingQueue.get(i);
                if (t.getAppointmentId().equals(app.getId())) {
                    patientsAhead = i;
                    Doctor doc = doctorRepository.findById(app.getDoctorId()).orElse(null);
                    int dur = (doc != null && doc.getConsultationDurationMinutes() != null) ? doc.getConsultationDurationMinutes() : 10;
                    estimatedWaitMin = i * dur;
                    break;
                }
            }
        }

        return AppointmentResponseDto.builder()
                .id(app.getId())
                .patientId(app.getPatientId())
                .patientName(app.getPatientName())
                .patientEmail(app.getPatientEmail())
                .patientPhone(app.getPatientPhone())
                .patientAge(app.getPatientAge())
                .patientGender(app.getPatientGender())
                .doctorId(app.getDoctorId())
                .doctorName(app.getDoctorName())
                .doctorSpecialization(app.getDoctorSpecialization())
                .doctorRoom(app.getDoctorRoom())
                .departmentId(app.getDepartmentId())
                .departmentName(app.getDepartmentName())
                .departmentCode(app.getDepartmentCode())
                .appointmentDate(app.getAppointmentDate())
                .timeSlot(app.getTimeSlot())
                .tokenNumber(app.getTokenNumber())
                .tokenSequence(app.getTokenSequence())
                .priority(app.getPriority())
                .status(app.getStatus())
                .checkedIn(app.isCheckedIn())
                .checkedInTime(app.getCheckedInTime())
                .qrCodeData(app.getQrCodeData())
                .qrCodeImageBase64(app.getQrCodeImageBase64())
                .notes(app.getNotes())
                .currentLiveTokenSequence(currentLiveTokenSeq)
                .currentLiveTokenNumber(currentLiveTokenNum)
                .patientsAhead(patientsAhead)
                .estimatedWaitMinutes(estimatedWaitMin)
                .createdAt(app.getCreatedAt())
                .build();
    }

    public List<String> getBookedSlots(String doctorId, LocalDate date) {
        return appointmentRepository.findByDoctorIdAndAppointmentDateAndStatusNot(doctorId, date, AppointmentStatus.CANCELLED)
                .stream()
                .map(Appointment::getTimeSlot)
                .filter(s -> s != null && !s.isBlank())
                .distinct()
                .collect(Collectors.toList());
    }

    private LocalTime parseSlotStartTime(String timeSlot) {
        if (timeSlot == null || timeSlot.isBlank()) {
            return null;
        }
        try {
            // Examples: "09:00 AM - 09:30 AM", "02:30 PM - 03:00 PM"
            String startPart = timeSlot.split("-")[0].trim();
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("hh:mm a", Locale.ENGLISH);
            return LocalTime.parse(startPart, formatter);
        } catch (Exception e) {
            log.warn("Could not parse time slot start time: {}", timeSlot);
            return null;
        }
    }
}
