package com.hospital.queue.service;

import com.hospital.queue.model.Appointment;
import com.hospital.queue.repository.AppointmentRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class TokenGeneratorService {

    private final AppointmentRepository appointmentRepository;

    public TokenGeneratorService(AppointmentRepository appointmentRepository) {
        this.appointmentRepository = appointmentRepository;
    }

    public synchronized TokenResult generateToken(String departmentCode, String departmentId, LocalDate date) {
        String deptCode = (departmentCode != null && !departmentCode.isBlank()) ? departmentCode.toUpperCase() : "GEN";

        // Find all appointments for this department on this date
        List<Appointment> existing = appointmentRepository.findByDepartmentIdAndAppointmentDate(departmentId, date);

        int maxSequence = existing.stream()
                .mapToInt(a -> a.getTokenSequence() != null ? a.getTokenSequence() : 0)
                .max()
                .orElse(0);

        int nextSequence = maxSequence + 1;
        String formattedToken = String.format("%s-%03d", deptCode, nextSequence);

        return new TokenResult(formattedToken, nextSequence);
    }

    public record TokenResult(String tokenNumber, int sequence) {}
}
