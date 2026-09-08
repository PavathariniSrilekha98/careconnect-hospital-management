package com.hospital.queue.controller;

import com.hospital.queue.dto.AnalyticsReportDto;
import com.hospital.queue.dto.ApiResponse;
import com.hospital.queue.dto.DashboardStatsDto;
import com.hospital.queue.dto.DoctorDto;
import com.hospital.queue.security.UserPrincipal;
import com.hospital.queue.service.AnalyticsService;
import com.hospital.queue.service.DoctorService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class DashboardController {

    private final AnalyticsService analyticsService;
    private final DoctorService doctorService;

    public DashboardController(AnalyticsService analyticsService, DoctorService doctorService) {
        this.analyticsService = analyticsService;
        this.doctorService = doctorService;
    }

    @GetMapping("/admin/dashboard")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<DashboardStatsDto>> getAdminDashboardStats() {
        DashboardStatsDto stats = analyticsService.getAdminDashboardStats();
        return ResponseEntity.ok(ApiResponse.ok("Admin dashboard stats", stats));
    }

    @GetMapping("/doctor/dashboard")
    @PreAuthorize("hasAnyRole('DOCTOR', 'ADMIN')")
    public ResponseEntity<ApiResponse<DashboardStatsDto>> getDoctorDashboardStats(
            @AuthenticationPrincipal UserPrincipal currentUser) {
        DoctorDto doctor = doctorService.getDoctorByUserId(currentUser.getId());
        DashboardStatsDto stats = analyticsService.getDoctorDashboardStats(doctor.getId());
        return ResponseEntity.ok(ApiResponse.ok("Doctor dashboard stats", stats));
    }

    @GetMapping("/doctor/{doctorId}/dashboard")
    @PreAuthorize("hasAnyRole('DOCTOR', 'ADMIN')")
    public ResponseEntity<ApiResponse<DashboardStatsDto>> getDoctorDashboardById(@PathVariable String doctorId) {
        DashboardStatsDto stats = analyticsService.getDoctorDashboardStats(doctorId);
        return ResponseEntity.ok(ApiResponse.ok("Doctor dashboard stats", stats));
    }

    @GetMapping("/admin/analytics")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<AnalyticsReportDto>> getAnalyticsReport() {
        AnalyticsReportDto report = analyticsService.getAnalyticsReport();
        return ResponseEntity.ok(ApiResponse.ok("Analytics report", report));
    }
}
