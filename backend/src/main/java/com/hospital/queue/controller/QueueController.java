package com.hospital.queue.controller;

import com.hospital.queue.dto.ApiResponse;
import com.hospital.queue.dto.PriorityUpdateRequestDto;
import com.hospital.queue.dto.QueueStatusUpdateDto;
import com.hospital.queue.dto.QueueTicketDto;
import com.hospital.queue.security.UserPrincipal;
import com.hospital.queue.service.QueueService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/queues")
public class QueueController {

    private final QueueService queueService;

    public QueueController(QueueService queueService) {
        this.queueService = queueService;
    }

    @GetMapping("/doctor/{doctorId}")
    public ResponseEntity<ApiResponse<List<QueueTicketDto>>> getDoctorQueue(
            @PathVariable String doctorId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        List<QueueTicketDto> queue = queueService.getLiveQueueForDoctor(doctorId, date);
        return ResponseEntity.ok(ApiResponse.ok("Doctor live queue fetched", queue));
    }

    @GetMapping("/department/{departmentId}")
    public ResponseEntity<ApiResponse<List<QueueTicketDto>>> getDepartmentQueue(
            @PathVariable String departmentId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        List<QueueTicketDto> queue = queueService.getLiveQueueForDepartment(departmentId, date);
        return ResponseEntity.ok(ApiResponse.ok("Department live queue fetched", queue));
    }

    @PostMapping("/doctor/{doctorId}/next")
    @PreAuthorize("hasAnyRole('DOCTOR', 'ADMIN')")
    public ResponseEntity<ApiResponse<QueueTicketDto>> callNextPatient(
            @PathVariable String doctorId,
            @AuthenticationPrincipal UserPrincipal currentUser,
            HttpServletRequest request) {
        QueueTicketDto ticket = queueService.callNextPatient(
                doctorId, currentUser.getId(), currentUser.getEmail(), request.getRemoteAddr()
        );
        return ResponseEntity.ok(ApiResponse.ok("Next patient called: Token " + ticket.getTokenNumber(), ticket));
    }

    @PatchMapping("/{ticketId}/status")
    @PreAuthorize("hasAnyRole('DOCTOR', 'ADMIN')")
    public ResponseEntity<ApiResponse<QueueTicketDto>> updateTicketStatus(
            @PathVariable String ticketId,
            @RequestBody QueueStatusUpdateDto dto,
            @AuthenticationPrincipal UserPrincipal currentUser,
            HttpServletRequest request) {
        QueueTicketDto ticket = queueService.updateTicketStatus(
                ticketId, dto, currentUser.getId(), currentUser.getEmail(), currentUser.getRole().name(), request.getRemoteAddr()
        );
        return ResponseEntity.ok(ApiResponse.ok("Queue status updated", ticket));
    }

    @PatchMapping("/{ticketId}/priority")
    @PreAuthorize("hasAnyRole('DOCTOR', 'ADMIN')")
    public ResponseEntity<ApiResponse<QueueTicketDto>> updatePriority(
            @PathVariable String ticketId,
            @Valid @RequestBody PriorityUpdateRequestDto dto,
            @AuthenticationPrincipal UserPrincipal currentUser,
            HttpServletRequest request) {
        QueueTicketDto ticket = queueService.updatePriority(
                ticketId, dto, currentUser.getId(), currentUser.getEmail(), currentUser.getRole().name(), request.getRemoteAddr()
        );
        return ResponseEntity.ok(ApiResponse.ok("Priority updated to " + dto.getPriority(), ticket));
    }
}
