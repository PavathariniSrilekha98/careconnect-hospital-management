package com.hospital.queue.controller;

import com.hospital.queue.dto.ApiResponse;
import com.hospital.queue.dto.AppointmentRequestDto;
import com.hospital.queue.dto.AppointmentResponseDto;
import com.hospital.queue.security.UserPrincipal;
import com.hospital.queue.service.AppointmentService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/appointments")
public class AppointmentController {

    private final AppointmentService appointmentService;

    public AppointmentController(AppointmentService appointmentService) {
        this.appointmentService = appointmentService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<AppointmentResponseDto>> bookAppointment(
            @Valid @RequestBody AppointmentRequestDto request,
            @AuthenticationPrincipal UserPrincipal currentUser,
            HttpServletRequest servletRequest) {
        AppointmentResponseDto response = appointmentService.bookAppointment(request, currentUser.getId(), servletRequest.getRemoteAddr());
        return ResponseEntity.ok(ApiResponse.ok("Appointment booked successfully. Token: " + response.getTokenNumber(), response));
    }

    @GetMapping("/booked-slots")
    public ResponseEntity<ApiResponse<List<String>>> getBookedSlots(
            @RequestParam String doctorId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        List<String> slots = appointmentService.getBookedSlots(doctorId, date);
        return ResponseEntity.ok(ApiResponse.ok("Booked slots fetched", slots));
    }

    @GetMapping("/my")
    public ResponseEntity<ApiResponse<List<AppointmentResponseDto>>> getMyAppointments(
            @AuthenticationPrincipal UserPrincipal currentUser) {
        List<AppointmentResponseDto> list = appointmentService.getMyAppointments(currentUser.getId());
        return ResponseEntity.ok(ApiResponse.ok("Patient appointments fetched", list));
    }

    @GetMapping("/doctor/{doctorId}")
    @PreAuthorize("hasAnyRole('DOCTOR', 'ADMIN')")
    public ResponseEntity<ApiResponse<List<AppointmentResponseDto>>> getDoctorAppointments(
            @PathVariable String doctorId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        List<AppointmentResponseDto> list = appointmentService.getDoctorAppointments(doctorId, date);
        return ResponseEntity.ok(ApiResponse.ok("Doctor appointments fetched", list));
    }

    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<AppointmentResponseDto>>> getAllAppointments(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        List<AppointmentResponseDto> list = appointmentService.getAllAppointments(date);
        return ResponseEntity.ok(ApiResponse.ok("All appointments fetched", list));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<AppointmentResponseDto>> getAppointmentById(@PathVariable String id) {
        AppointmentResponseDto app = appointmentService.getAppointmentById(id);
        return ResponseEntity.ok(ApiResponse.ok("Appointment details fetched", app));
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<ApiResponse<AppointmentResponseDto>> cancelAppointment(
            @PathVariable String id,
            @RequestBody(required = false) Map<String, String> payload,
            @AuthenticationPrincipal UserPrincipal currentUser,
            HttpServletRequest request) {
        String reason = payload != null ? payload.get("reason") : "Patient requested cancellation";
        AppointmentResponseDto app = appointmentService.cancelAppointment(
                id, currentUser.getId(), currentUser.getRole().name(), currentUser.getEmail(), request.getRemoteAddr()
        );
        return ResponseEntity.ok(ApiResponse.ok("Appointment cancelled successfully", app));
    }

    @PutMapping("/{id}/reschedule")
    public ResponseEntity<ApiResponse<AppointmentResponseDto>> rescheduleAppointment(
            @PathVariable String id,
            @RequestBody Map<String, String> payload,
            @AuthenticationPrincipal UserPrincipal currentUser,
            HttpServletRequest request) {
        LocalDate newDate = LocalDate.parse(payload.get("date"));
        String newSlot = payload.get("timeSlot");

        AppointmentResponseDto app = appointmentService.rescheduleAppointment(
                id, newDate, newSlot, currentUser.getId(), currentUser.getRole().name(), currentUser.getEmail(), request.getRemoteAddr()
        );
        return ResponseEntity.ok(ApiResponse.ok("Appointment rescheduled successfully. New Token: " + app.getTokenNumber(), app));
    }
}
