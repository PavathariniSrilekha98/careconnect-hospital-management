package com.hospital.queue.service;

import com.hospital.queue.dto.PriorityUpdateRequestDto;
import com.hospital.queue.dto.QueueStatusUpdateDto;
import com.hospital.queue.dto.QueueTicketDto;
import com.hospital.queue.exception.BadRequestException;
import com.hospital.queue.exception.ResourceNotFoundException;
import com.hospital.queue.model.*;
import com.hospital.queue.repository.AppointmentRepository;
import com.hospital.queue.repository.DepartmentRepository;
import com.hospital.queue.repository.DoctorRepository;
import com.hospital.queue.repository.QueueTicketRepository;
import com.hospital.queue.util.AppConstants;
import com.hospital.queue.websocket.WebSocketMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class QueueService {

    private static final Logger log = LoggerFactory.getLogger(QueueService.class);

    private final QueueTicketRepository queueTicketRepository;
    private final AppointmentRepository appointmentRepository;
    private final DoctorRepository doctorRepository;
    private final DepartmentRepository departmentRepository;
    private final NotificationService notificationService;
    private final AuditLogService auditLogService;
    private final SimpMessagingTemplate messagingTemplate;

    public QueueService(QueueTicketRepository queueTicketRepository,
                        AppointmentRepository appointmentRepository,
                        DoctorRepository doctorRepository,
                        DepartmentRepository departmentRepository,
                        NotificationService notificationService,
                        AuditLogService auditLogService,
                        SimpMessagingTemplate messagingTemplate) {
        this.queueTicketRepository = queueTicketRepository;
        this.appointmentRepository = appointmentRepository;
        this.doctorRepository = doctorRepository;
        this.departmentRepository = departmentRepository;
        this.notificationService = notificationService;
        this.auditLogService = auditLogService;
        this.messagingTemplate = messagingTemplate;
    }

    public Double calculatePriorityScore(PriorityLevel priority, Integer tokenSequence) {
        double base = 1000.0 - (tokenSequence != null ? tokenSequence : 999);
        return switch (priority) {
            case EMERGENCY -> 100000.0 + base;
            case SENIOR_CITIZEN -> 50000.0 + base;
            case NORMAL -> base;
        };
    }

    public QueueTicket createQueueTicketForAppointment(Appointment appointment) {
        // Check if ticket already exists
        Optional<QueueTicket> existing = queueTicketRepository.findByAppointmentId(appointment.getId());
        if (existing.isPresent()) {
            return existing.get();
        }

        Doctor doctor = doctorRepository.findById(appointment.getDoctorId()).orElse(null);
        String room = (doctor != null && doctor.getRoomNumber() != null) ? doctor.getRoomNumber() : appointment.getDoctorRoom();

        QueueTicket ticket = QueueTicket.builder()
                .appointmentId(appointment.getId())
                .tokenNumber(appointment.getTokenNumber())
                .tokenSequence(appointment.getTokenSequence())
                .departmentId(appointment.getDepartmentId())
                .departmentName(appointment.getDepartmentName())
                .departmentCode(appointment.getDepartmentCode())
                .doctorId(appointment.getDoctorId())
                .doctorName(appointment.getDoctorName())
                .roomNumber(room)
                .patientId(appointment.getPatientId())
                .patientName(appointment.getPatientName())
                .patientPhone(appointment.getPatientPhone())
                .patientAge(appointment.getPatientAge())
                .patientGender(appointment.getPatientGender())
                .queueDate(appointment.getAppointmentDate())
                .priority(appointment.getPriority() != null ? appointment.getPriority() : PriorityLevel.NORMAL)
                .status(QueueStatus.WAITING)
                .priorityScore(calculatePriorityScore(appointment.getPriority() != null ? appointment.getPriority() : PriorityLevel.NORMAL, appointment.getTokenSequence()))
                .checkInTime(Instant.now())
                .createdAt(Instant.now())
                .updatedAt(Instant.now())
                .build();

        QueueTicket saved = queueTicketRepository.save(ticket);

        // Update appointment status to IN_QUEUE
        appointment.setStatus(AppointmentStatus.IN_QUEUE);
        appointment.setCheckedIn(true);
        appointment.setCheckedInTime(Instant.now());
        appointmentRepository.save(appointment);

        // Broadcast queue update
        broadcastQueueUpdate(saved.getDepartmentId(), saved.getDoctorId());

        return saved;
    }

    public List<QueueTicketDto> getLiveQueueForDoctor(String doctorId, LocalDate date) {
        LocalDate targetDate = (date != null) ? date : LocalDate.now();
        List<QueueTicket> tickets = queueTicketRepository.findByDoctorIdAndQueueDateOrderByPriorityScoreDescTokenSequenceAsc(doctorId, targetDate);

        return enrichAndMapTickets(tickets, doctorId);
    }

    public List<QueueTicketDto> getLiveQueueForDepartment(String departmentId, LocalDate date) {
        LocalDate targetDate = (date != null) ? date : LocalDate.now();
        List<QueueTicket> tickets = queueTicketRepository.findByDepartmentIdAndQueueDateOrderByPriorityScoreDescTokenSequenceAsc(departmentId, targetDate);

        return enrichAndMapTickets(tickets, null);
    }

    public QueueTicketDto callNextPatient(String doctorId, String callerUserId, String callerEmail, String ipAddress) {
        LocalDate today = LocalDate.now();

        // 1. If doctor currently has a patient in CALLED or IN_CONSULTATION, mark them COMPLETED if next is called
        List<QueueTicket> activeServing = queueTicketRepository.findByDoctorIdAndQueueDateAndStatus(doctorId, today, QueueStatus.IN_CONSULTATION);
        for (QueueTicket t : activeServing) {
            t.setStatus(QueueStatus.COMPLETED);
            t.setCompletedTime(Instant.now());
            t.setUpdatedAt(Instant.now());
            queueTicketRepository.save(t);
            updateAppointmentStatus(t.getAppointmentId(), AppointmentStatus.COMPLETED);
        }

        List<QueueTicket> calledList = queueTicketRepository.findByDoctorIdAndQueueDateAndStatus(doctorId, today, QueueStatus.CALLED);
        for (QueueTicket t : calledList) {
            t.setStatus(QueueStatus.COMPLETED);
            t.setCompletedTime(Instant.now());
            t.setUpdatedAt(Instant.now());
            queueTicketRepository.save(t);
            updateAppointmentStatus(t.getAppointmentId(), AppointmentStatus.COMPLETED);
        }

        // 2. Find next WAITING patient with highest priority
        List<QueueTicket> waitingList = queueTicketRepository.findByDoctorIdAndQueueDateOrderByPriorityScoreDescTokenSequenceAsc(doctorId, today)
                .stream()
                .filter(t -> t.getStatus() == QueueStatus.WAITING)
                .collect(Collectors.toList());

        if (waitingList.isEmpty()) {
            throw new BadRequestException("No waiting patients in queue for this doctor today.");
        }

        QueueTicket nextTicket = waitingList.get(0);
        nextTicket.setStatus(QueueStatus.CALLED);
        nextTicket.setCalledTime(Instant.now());
        nextTicket.setUpdatedAt(Instant.now());

        QueueTicket saved = queueTicketRepository.save(nextTicket);
        updateAppointmentStatus(saved.getAppointmentId(), AppointmentStatus.CALLED);

        // Notify next patient that their turn has arrived
        notificationService.createAndSendNotification(
                saved.getPatientId(),
                "Your Token Is Called: " + saved.getTokenNumber(),
                "Please proceed to " + saved.getRoomNumber() + " for consultation with Dr. " + saved.getDoctorName() + ".",
                "TOKEN_CALLED",
                saved.getAppointmentId(),
                saved.getTokenNumber(),
                saved.getRoomNumber()
        );

        // Notify upcoming patients (e.g. position 1 and 2 in line)
        if (waitingList.size() > 1) {
            QueueTicket secondInLine = waitingList.get(1);
            notificationService.createAndSendNotification(
                    secondInLine.getPatientId(),
                    "Your Turn Is Approaching!",
                    "Token " + saved.getTokenNumber() + " is currently called. You are next in line (" + secondInLine.getTokenNumber() + ").",
                    "TURN_APPROACHING",
                    secondInLine.getAppointmentId(),
                    secondInLine.getTokenNumber(),
                    secondInLine.getRoomNumber()
            );
        }

        // Broadcast WebSocket Event: NEXT_PATIENT_CALLED
        broadcastNextPatientCalled(saved);
        broadcastQueueUpdate(saved.getDepartmentId(), saved.getDoctorId());

        auditLogService.log(
                callerUserId,
                callerEmail,
                "DOCTOR",
                "TOKEN_CALLED",
                "QueueTicket",
                saved.getId(),
                "Called next patient: Token " + saved.getTokenNumber() + " (Patient: " + saved.getPatientName() + ")",
                ipAddress
        );

        return mapToDto(saved, 0, 0, 0);
    }

    public QueueTicketDto updateTicketStatus(String ticketId, QueueStatusUpdateDto dto, String userId, String email, String role, String ipAddress) {
        QueueTicket ticket = queueTicketRepository.findById(ticketId)
                .orElseThrow(() -> new ResourceNotFoundException("QueueTicket", "id", ticketId));

        QueueStatus oldStatus = ticket.getStatus();
        QueueStatus newStatus = dto.getStatus();
        ticket.setStatus(newStatus);
        ticket.setUpdatedAt(Instant.now());

        if (newStatus == QueueStatus.IN_CONSULTATION) {
            ticket.setConsultationStartTime(Instant.now());
            updateAppointmentStatus(ticket.getAppointmentId(), AppointmentStatus.IN_CONSULTATION);
        } else if (newStatus == QueueStatus.COMPLETED) {
            ticket.setCompletedTime(Instant.now());
            updateAppointmentStatus(ticket.getAppointmentId(), AppointmentStatus.COMPLETED);
        } else if (newStatus == QueueStatus.SKIPPED) {
            updateAppointmentStatus(ticket.getAppointmentId(), AppointmentStatus.SKIPPED);
            notificationService.createAndSendNotification(
                    ticket.getPatientId(),
                    "Token Skipped: " + ticket.getTokenNumber(),
                    "Your token was skipped because you were not present when called. Please contact the front desk or doctor.",
                    "TOKEN_SKIPPED",
                    ticket.getAppointmentId(),
                    ticket.getTokenNumber(),
                    ticket.getRoomNumber()
            );
        } else if (newStatus == QueueStatus.ABSENT) {
            updateAppointmentStatus(ticket.getAppointmentId(), AppointmentStatus.ABSENT);
        }

        QueueTicket saved = queueTicketRepository.save(ticket);
        broadcastQueueUpdate(saved.getDepartmentId(), saved.getDoctorId());

        auditLogService.log(
                userId,
                email,
                role,
                "QUEUE_STATUS_CHANGED",
                "QueueTicket",
                saved.getId(),
                "Status changed from " + oldStatus + " to " + newStatus + " for Token " + saved.getTokenNumber(),
                ipAddress
        );

        return mapToDto(saved, 0, 0, 0);
    }

    public QueueTicketDto updatePriority(String ticketId, PriorityUpdateRequestDto dto, String userId, String email, String role, String ipAddress) {
        QueueTicket ticket = queueTicketRepository.findById(ticketId)
                .orElseThrow(() -> new ResourceNotFoundException("QueueTicket", "id", ticketId));

        ticket.setPriority(dto.getPriority());
        ticket.setPriorityScore(calculatePriorityScore(dto.getPriority(), ticket.getTokenSequence()));
        ticket.setUpdatedAt(Instant.now());

        QueueTicket saved = queueTicketRepository.save(ticket);

        // Also update appointment priority
        appointmentRepository.findById(ticket.getAppointmentId()).ifPresent(app -> {
            app.setPriority(dto.getPriority());
            appointmentRepository.save(app);
        });

        broadcastQueueUpdate(saved.getDepartmentId(), saved.getDoctorId());

        auditLogService.log(
                userId,
                email,
                role,
                "PRIORITY_UPDATED",
                "QueueTicket",
                saved.getId(),
                "Priority updated to " + dto.getPriority() + " for Token " + saved.getTokenNumber() + (dto.getReason() != null ? " (" + dto.getReason() + ")" : ""),
                ipAddress
        );

        return mapToDto(saved, 0, 0, 0);
    }

    public Map<String, Object> getHospitalPublicDisplayFeed() {
        LocalDate today = LocalDate.now();
        List<Department> departments = departmentRepository.findByActiveTrue();

        List<Map<String, Object>> departmentDisplays = new ArrayList<>();

        for (Department dept : departments) {
            List<QueueTicket> tickets = queueTicketRepository.findByDepartmentIdAndQueueDateOrderByPriorityScoreDescTokenSequenceAsc(dept.getId(), today);

            QueueTicket currentlyServing = tickets.stream()
                    .filter(t -> t.getStatus() == QueueStatus.CALLED || t.getStatus() == QueueStatus.IN_CONSULTATION)
                    .findFirst()
                    .orElse(null);

            List<QueueTicket> upcomingWaiting = tickets.stream()
                    .filter(t -> t.getStatus() == QueueStatus.WAITING)
                    .limit(5)
                    .collect(Collectors.toList());

            Map<String, Object> deptMap = new HashMap<>();
            deptMap.put("departmentId", dept.getId());
            deptMap.put("departmentName", dept.getName());
            deptMap.put("departmentCode", dept.getCode());
            deptMap.put("roomBlock", dept.getRoomBlock());
            deptMap.put("nowServing", currentlyServing != null ? mapToDto(currentlyServing, 0, 0, 0) : null);
            deptMap.put("upcomingTokens", upcomingWaiting.stream().map(t -> t.getTokenNumber()).collect(Collectors.toList()));
            deptMap.put("waitingCount", tickets.stream().filter(t -> t.getStatus() == QueueStatus.WAITING).count());

            departmentDisplays.add(deptMap);
        }

        Map<String, Object> response = new HashMap<>();
        response.put("hospitalName", "CITY CARE MULTI-SPECIALTY HOSPITAL");
        response.put("serverTime", Instant.now());
        response.put("departments", departmentDisplays);

        return response;
    }

    private void updateAppointmentStatus(String appointmentId, AppointmentStatus status) {
        if (appointmentId == null) return;
        appointmentRepository.findById(appointmentId).ifPresent(app -> {
            app.setStatus(status);
            if (status == AppointmentStatus.CALLED) {
                app.setCallStartTime(Instant.now());
            } else if (status == AppointmentStatus.IN_CONSULTATION) {
                app.setConsultationStartTime(Instant.now());
            } else if (status == AppointmentStatus.COMPLETED) {
                app.setConsultationEndTime(Instant.now());
            }
            appointmentRepository.save(app);
        });
    }

    private List<QueueTicketDto> enrichAndMapTickets(List<QueueTicket> tickets, String doctorId) {
        int avgDuration = 10;
        if (doctorId != null) {
            Doctor doc = doctorRepository.findById(doctorId).orElse(null);
            if (doc != null && doc.getConsultationDurationMinutes() != null) {
                avgDuration = doc.getConsultationDurationMinutes();
            }
        }

        List<QueueTicketDto> dtos = new ArrayList<>();
        int waitingIndex = 0;

        for (QueueTicket ticket : tickets) {
            int pos = 0;
            int ahead = 0;
            int waitMin = 0;

            if (ticket.getStatus() == QueueStatus.WAITING) {
                pos = waitingIndex + 1;
                ahead = waitingIndex;
                waitMin = ahead * avgDuration;
                waitingIndex++;
            }

            dtos.add(mapToDto(ticket, pos, ahead, waitMin));
        }

        return dtos;
    }

    private void broadcastNextPatientCalled(QueueTicket ticket) {
        try {
            WebSocketMessage<QueueTicketDto> wsMsg = WebSocketMessage.<QueueTicketDto>builder()
                    .type(AppConstants.EVENT_NEXT_PATIENT_CALLED)
                    .departmentId(ticket.getDepartmentId())
                    .doctorId(ticket.getDoctorId())
                    .tokenNumber(ticket.getTokenNumber())
                    .roomNumber(ticket.getRoomNumber())
                    .message("Token " + ticket.getTokenNumber() + " is called for Room " + ticket.getRoomNumber())
                    .payload(mapToDto(ticket, 0, 0, 0))
                    .timestamp(Instant.now())
                    .build();

            messagingTemplate.convertAndSend(AppConstants.TOPIC_PUBLIC_DISPLAY, wsMsg);
            messagingTemplate.convertAndSend(AppConstants.TOPIC_QUEUE_DEPARTMENT + ticket.getDepartmentId(), wsMsg);
            messagingTemplate.convertAndSend(AppConstants.TOPIC_QUEUE_DOCTOR + ticket.getDoctorId(), wsMsg);
            log.info("Broadcasted NEXT_PATIENT_CALLED for Token: {}", ticket.getTokenNumber());
        } catch (Exception e) {
            log.warn("Failed to broadcast NEXT_PATIENT_CALLED: {}", e.getMessage());
        }
    }

    public void broadcastQueueUpdate(String departmentId, String doctorId) {
        try {
            WebSocketMessage<String> wsMsg = WebSocketMessage.<String>builder()
                    .type(AppConstants.EVENT_QUEUE_UPDATED)
                    .departmentId(departmentId)
                    .doctorId(doctorId)
                    .message("Queue has been updated")
                    .timestamp(Instant.now())
                    .build();

            if (departmentId != null) {
                messagingTemplate.convertAndSend(AppConstants.TOPIC_QUEUE_DEPARTMENT + departmentId, wsMsg);
            }
            if (doctorId != null) {
                messagingTemplate.convertAndSend(AppConstants.TOPIC_QUEUE_DOCTOR + doctorId, wsMsg);
            }
            messagingTemplate.convertAndSend(AppConstants.TOPIC_PUBLIC_DISPLAY, wsMsg);
        } catch (Exception e) {
            log.warn("Failed to broadcast queue update: {}", e.getMessage());
        }
    }

    public QueueTicketDto mapToDto(QueueTicket ticket, int position, int patientsAhead, int estimatedWaitMinutes) {
        return QueueTicketDto.builder()
                .id(ticket.getId())
                .appointmentId(ticket.getAppointmentId())
                .tokenNumber(ticket.getTokenNumber())
                .tokenSequence(ticket.getTokenSequence())
                .departmentId(ticket.getDepartmentId())
                .departmentName(ticket.getDepartmentName())
                .departmentCode(ticket.getDepartmentCode())
                .doctorId(ticket.getDoctorId())
                .doctorName(ticket.getDoctorName())
                .roomNumber(ticket.getRoomNumber())
                .patientId(ticket.getPatientId())
                .patientName(ticket.getPatientName())
                .patientPhone(ticket.getPatientPhone())
                .patientAge(ticket.getPatientAge())
                .patientGender(ticket.getPatientGender())
                .queueDate(ticket.getQueueDate())
                .priority(ticket.getPriority())
                .status(ticket.getStatus())
                .positionInQueue(position)
                .patientsAhead(patientsAhead)
                .estimatedWaitMinutes(estimatedWaitMinutes)
                .checkInTime(ticket.getCheckInTime())
                .calledTime(ticket.getCalledTime())
                .consultationStartTime(ticket.getConsultationStartTime())
                .completedTime(ticket.getCompletedTime())
                .createdAt(ticket.getCreatedAt())
                .build();
    }
}
