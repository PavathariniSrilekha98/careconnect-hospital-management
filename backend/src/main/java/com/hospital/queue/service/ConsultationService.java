package com.hospital.queue.service;

import com.hospital.queue.dto.ConsultationDto;
import com.hospital.queue.dto.QueueStatusUpdateDto;
import com.hospital.queue.exception.BadRequestException;
import com.hospital.queue.exception.ResourceNotFoundException;
import com.hospital.queue.model.Appointment;
import com.hospital.queue.model.AppointmentStatus;
import com.hospital.queue.model.Consultation;
import com.hospital.queue.model.Doctor;
import com.hospital.queue.model.QueueStatus;
import com.hospital.queue.model.User;
import com.hospital.queue.repository.AppointmentRepository;
import com.hospital.queue.repository.ConsultationRepository;
import com.hospital.queue.repository.DoctorRepository;
import com.hospital.queue.repository.QueueTicketRepository;
import com.hospital.queue.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class ConsultationService {

    private static final Logger log = LoggerFactory.getLogger(ConsultationService.class);

    private final ConsultationRepository consultationRepository;
    private final AppointmentRepository appointmentRepository;
    private final QueueTicketRepository queueTicketRepository;
    private final DoctorRepository doctorRepository;
    private final UserRepository userRepository;
    private final QueueService queueService;
    private final NotificationService notificationService;
    private final AuditLogService auditLogService;

    public ConsultationService(ConsultationRepository consultationRepository,
                               AppointmentRepository appointmentRepository,
                               QueueTicketRepository queueTicketRepository,
                               DoctorRepository doctorRepository,
                               UserRepository userRepository,
                               QueueService queueService,
                               NotificationService notificationService,
                               AuditLogService auditLogService) {
        this.consultationRepository = consultationRepository;
        this.appointmentRepository = appointmentRepository;
        this.queueTicketRepository = queueTicketRepository;
        this.doctorRepository = doctorRepository;
        this.userRepository = userRepository;
        this.queueService = queueService;
        this.notificationService = notificationService;
        this.auditLogService = auditLogService;
    }

    public ConsultationDto createOrUpdateConsultation(ConsultationDto dto, String doctorUserId, String doctorEmail, String ipAddress) {
        Appointment appointment = appointmentRepository.findById(dto.getAppointmentId())
                .orElseThrow(() -> new ResourceNotFoundException("Appointment", "id", dto.getAppointmentId()));

        Consultation consultation = consultationRepository.findByAppointmentId(appointment.getId())
                .orElse(null);

        if (consultation == null) {
            consultation = Consultation.builder()
                    .appointmentId(appointment.getId())
                    .patientId(appointment.getPatientId())
                    .patientName(appointment.getPatientName())
                    .doctorId(appointment.getDoctorId())
                    .doctorName(appointment.getDoctorName())
                    .departmentName(appointment.getDepartmentName())
                    .tokenNumber(appointment.getTokenNumber())
                    .createdAt(Instant.now())
                    .build();
        } else {
            if (consultation.getPatientId() == null) consultation.setPatientId(appointment.getPatientId());
            if (consultation.getDoctorId() == null) consultation.setDoctorId(appointment.getDoctorId());
            if (consultation.getPatientName() == null) consultation.setPatientName(appointment.getPatientName());
            if (consultation.getDoctorName() == null) consultation.setDoctorName(appointment.getDoctorName());
            if (consultation.getDepartmentName() == null) consultation.setDepartmentName(appointment.getDepartmentName());
            if (consultation.getTokenNumber() == null) consultation.setTokenNumber(appointment.getTokenNumber());
        }

        consultation.setSymptoms(dto.getSymptoms() != null ? dto.getSymptoms() : appointment.getNotes());
        consultation.setDiagnosis(dto.getDiagnosis());
        consultation.setClinicalNotes(dto.getClinicalNotes());
        consultation.setVitals(dto.getVitals());
        consultation.setPrescriptionItems(dto.getPrescriptionItems());
        consultation.setFollowUpDate(dto.getFollowUpDate());
        consultation.setDurationMinutes(dto.getDurationMinutes());
        consultation.setUpdatedAt(Instant.now());

        Consultation saved = consultationRepository.save(consultation);

        // Update appointment status to COMPLETED
        appointment.setStatus(AppointmentStatus.COMPLETED);
        appointment.setConsultationEndTime(Instant.now());
        appointmentRepository.save(appointment);

        // Update queue ticket to COMPLETED
        queueTicketRepository.findByAppointmentId(appointment.getId()).ifPresent(ticket -> {
            ticket.setStatus(QueueStatus.COMPLETED);
            ticket.setCompletedTime(Instant.now());
            ticket.setUpdatedAt(Instant.now());
            queueTicketRepository.save(ticket);
            queueService.broadcastQueueUpdate(ticket.getDepartmentId(), ticket.getDoctorId());
        });

        // Notify patient that prescription & consultation notes are available
        notificationService.createAndSendNotification(
                appointment.getPatientId(),
                "Consultation Completed",
                "Your consultation with Dr. " + appointment.getDoctorName() + " is complete. Your prescription is now available in your portal.",
                "CONSULTATION_COMPLETED",
                appointment.getId(),
                appointment.getTokenNumber(),
                appointment.getDoctorRoom()
        );

        auditLogService.log(
                doctorUserId,
                doctorEmail,
                "DOCTOR",
                "CONSULTATION_COMPLETED",
                "Consultation",
                saved.getId(),
                "Recorded consultation & prescription for Token " + appointment.getTokenNumber() + " (Patient: " + appointment.getPatientName() + ")",
                ipAddress
        );

        return mapToDto(saved);
    }

    public ConsultationDto getConsultationByAppointmentId(String appointmentId) {
        Consultation consultation = consultationRepository.findByAppointmentId(appointmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Consultation", "appointmentId", appointmentId));
        return mapToDto(consultation);
    }

    public List<ConsultationDto> getPatientConsultations(String patientIdOrUserId) {
        Set<String> patientIds = new HashSet<>();
        patientIds.add(patientIdOrUserId);

        userRepository.findById(patientIdOrUserId).ifPresent(u -> {
            patientIds.add(u.getId());
            if (u.getEmail() != null) patientIds.add(u.getEmail());
        });

        // Also find by appointments belonging to this patient
        List<Appointment> patientAppts = appointmentRepository.findByPatientIdOrderByAppointmentDateDesc(patientIdOrUserId);
        for (Appointment a : patientAppts) {
            if (a.getPatientId() != null) patientIds.add(a.getPatientId());
        }

        List<Consultation> list = consultationRepository.findByPatientIdInOrderByCreatedAtDesc(patientIds);
        if (list.isEmpty()) {
            list = consultationRepository.findByPatientIdOrderByCreatedAtDesc(patientIdOrUserId);
        }
        return list.stream().map(this::mapToDto).collect(Collectors.toList());
    }

    public List<ConsultationDto> getDoctorConsultations(String doctorIdOrUserId) {
        Set<String> doctorIds = new HashSet<>();
        doctorIds.add(doctorIdOrUserId);
        String docName = null;

        Doctor doctor = doctorRepository.findById(doctorIdOrUserId)
                .orElseGet(() -> doctorRepository.findByUserId(doctorIdOrUserId).orElse(null));

        if (doctor != null) {
            doctorIds.add(doctor.getId());
            if (doctor.getUserId() != null) doctorIds.add(doctor.getUserId());
            docName = doctor.getFullName();
        }

        List<Consultation> list = consultationRepository.findByDoctorIdInOrderByCreatedAtDesc(doctorIds);
        if (list.isEmpty() && docName != null) {
            list = consultationRepository.findByDoctorIdInOrDoctorNameOrderByCreatedAtDesc(doctorIds, docName);
        }
        return list.stream().map(this::mapToDto).collect(Collectors.toList());
    }

    private ConsultationDto mapToDto(Consultation c) {
        return ConsultationDto.builder()
                .id(c.getId())
                .appointmentId(c.getAppointmentId())
                .patientId(c.getPatientId())
                .patientName(c.getPatientName())
                .doctorId(c.getDoctorId())
                .doctorName(c.getDoctorName())
                .departmentName(c.getDepartmentName())
                .tokenNumber(c.getTokenNumber())
                .symptoms(c.getSymptoms())
                .diagnosis(c.getDiagnosis())
                .clinicalNotes(c.getClinicalNotes())
                .vitals(c.getVitals())
                .prescriptionItems(c.getPrescriptionItems())
                .followUpDate(c.getFollowUpDate())
                .durationMinutes(c.getDurationMinutes())
                .createdAt(c.getCreatedAt())
                .build();
    }
}
