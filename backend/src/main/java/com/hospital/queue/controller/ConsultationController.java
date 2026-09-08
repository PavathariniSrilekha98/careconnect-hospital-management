package com.hospital.queue.controller;

import com.hospital.queue.dto.ApiResponse;
import com.hospital.queue.dto.ConsultationDto;
import com.hospital.queue.security.UserPrincipal;
import com.hospital.queue.service.ConsultationService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/consultations")
public class ConsultationController {

    private final ConsultationService consultationService;

    public ConsultationController(ConsultationService consultationService) {
        this.consultationService = consultationService;
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('DOCTOR', 'ADMIN')")
    public ResponseEntity<ApiResponse<ConsultationDto>> createOrUpdateConsultation(
            @Valid @RequestBody ConsultationDto dto,
            @AuthenticationPrincipal UserPrincipal currentUser,
            HttpServletRequest request) {
        ConsultationDto result = consultationService.createOrUpdateConsultation(
                dto, currentUser.getId(), currentUser.getEmail(), request.getRemoteAddr()
        );
        return ResponseEntity.ok(ApiResponse.ok("Consultation and prescription recorded successfully", result));
    }

    @GetMapping("/appointment/{appointmentId}")
    public ResponseEntity<ApiResponse<ConsultationDto>> getByAppointmentId(@PathVariable String appointmentId) {
        ConsultationDto result = consultationService.getConsultationByAppointmentId(appointmentId);
        return ResponseEntity.ok(ApiResponse.ok("Consultation record fetched", result));
    }

    @GetMapping("/patient/{patientId}")
    public ResponseEntity<ApiResponse<List<ConsultationDto>>> getPatientConsultations(@PathVariable String patientId) {
        List<ConsultationDto> list = consultationService.getPatientConsultations(patientId);
        return ResponseEntity.ok(ApiResponse.ok("Patient consultation history fetched", list));
    }

    @GetMapping("/doctor/{doctorId}")
    @PreAuthorize("hasAnyRole('DOCTOR', 'ADMIN')")
    public ResponseEntity<ApiResponse<List<ConsultationDto>>> getDoctorConsultations(@PathVariable String doctorId) {
        List<ConsultationDto> list = consultationService.getDoctorConsultations(doctorId);
        return ResponseEntity.ok(ApiResponse.ok("Doctor consultation history fetched", list));
    }
}
