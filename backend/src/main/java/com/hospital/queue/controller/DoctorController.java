package com.hospital.queue.controller;

import com.hospital.queue.dto.ApiResponse;
import com.hospital.queue.dto.DoctorDto;
import com.hospital.queue.security.UserPrincipal;
import com.hospital.queue.service.DoctorService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/doctors")
public class DoctorController {

    private final DoctorService doctorService;

    public DoctorController(DoctorService doctorService) {
        this.doctorService = doctorService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<DoctorDto>>> getAllDoctors(
            @RequestParam(required = false) String departmentId,
            @RequestParam(required = false, defaultValue = "false") Boolean activeOnly) {
        List<DoctorDto> list = doctorService.getAllDoctors(departmentId, activeOnly);
        return ResponseEntity.ok(ApiResponse.ok("Doctors fetched successfully", list));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<DoctorDto>> getDoctorById(@PathVariable String id) {
        DoctorDto doc = doctorService.getDoctorById(id);
        return ResponseEntity.ok(ApiResponse.ok("Doctor fetched successfully", doc));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<ApiResponse<DoctorDto>> getDoctorByUserId(@PathVariable String userId) {
        DoctorDto doc = doctorService.getDoctorByUserId(userId);
        return ResponseEntity.ok(ApiResponse.ok("Doctor fetched successfully", doc));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<DoctorDto>> createDoctor(
            @Valid @RequestBody DoctorDto dto,
            @AuthenticationPrincipal UserPrincipal currentUser,
            HttpServletRequest request) {
        DoctorDto created = doctorService.createDoctor(dto, currentUser.getId(), currentUser.getEmail(), request.getRemoteAddr());
        return ResponseEntity.ok(ApiResponse.ok("Doctor created successfully", created));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR')")
    public ResponseEntity<ApiResponse<DoctorDto>> updateDoctor(
            @PathVariable String id,
            @RequestBody DoctorDto dto,
            @AuthenticationPrincipal UserPrincipal currentUser,
            HttpServletRequest request) {
        DoctorDto updated = doctorService.updateDoctor(id, dto, currentUser.getId(), currentUser.getRole().name(), currentUser.getEmail(), request.getRemoteAddr());
        return ResponseEntity.ok(ApiResponse.ok("Doctor updated successfully", updated));
    }

    @PatchMapping("/{id}/availability")
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR')")
    public ResponseEntity<ApiResponse<DoctorDto>> updateAvailability(
            @PathVariable String id,
            @RequestBody Map<String, String> payload,
            @AuthenticationPrincipal UserPrincipal currentUser,
            HttpServletRequest request) {
        String status = payload.getOrDefault("status", "AVAILABLE");
        DoctorDto updated = doctorService.updateAvailability(id, status, currentUser.getId(), currentUser.getEmail(), request.getRemoteAddr());
        return ResponseEntity.ok(ApiResponse.ok("Doctor availability updated", updated));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteDoctor(
            @PathVariable String id,
            @AuthenticationPrincipal UserPrincipal currentUser,
            HttpServletRequest request) {
        doctorService.deleteDoctor(id, currentUser.getId(), currentUser.getEmail(), request.getRemoteAddr());
        return ResponseEntity.ok(ApiResponse.ok("Doctor deactivated successfully", null));
    }
}
