package com.hospital.queue.controller;

import com.hospital.queue.dto.ApiResponse;
import com.hospital.queue.dto.AppointmentResponseDto;
import com.hospital.queue.dto.CheckInRequestDto;
import com.hospital.queue.service.AppointmentService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/check-in")
public class CheckInController {

    private final AppointmentService appointmentService;

    public CheckInController(AppointmentService appointmentService) {
        this.appointmentService = appointmentService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<AppointmentResponseDto>> checkIn(
            @Valid @RequestBody CheckInRequestDto request,
            HttpServletRequest servletRequest) {
        AppointmentResponseDto app = appointmentService.checkInViaQr(request, servletRequest.getRemoteAddr());
        return ResponseEntity.ok(ApiResponse.ok("Check-in successful. Token " + app.getTokenNumber() + " is active in the queue.", app));
    }
}
