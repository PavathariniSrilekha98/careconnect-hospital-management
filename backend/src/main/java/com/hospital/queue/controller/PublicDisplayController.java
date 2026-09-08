package com.hospital.queue.controller;

import com.hospital.queue.dto.ApiResponse;
import com.hospital.queue.service.QueueService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/display")
public class PublicDisplayController {

    private final QueueService queueService;

    public PublicDisplayController(QueueService queueService) {
        this.queueService = queueService;
    }

    @GetMapping("/live")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getHospitalDisplayFeed() {
        Map<String, Object> feed = queueService.getHospitalPublicDisplayFeed();
        return ResponseEntity.ok(ApiResponse.ok("Live hospital queue display feed", feed));
    }
}
