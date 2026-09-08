package com.hospital.queue.controller;

import com.hospital.queue.dto.ApiResponse;
import com.hospital.queue.dto.AuditLogDto;
import com.hospital.queue.service.AuditLogService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/audit-logs")
public class AuditLogController {

    private final AuditLogService auditLogService;

    public AuditLogController(AuditLogService auditLogService) {
        this.auditLogService = auditLogService;
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<AuditLogDto>>> getAuditLogs(
            @RequestParam(required = false) String action,
            @RequestParam(required = false) String userId) {
        List<AuditLogDto> list;
        if (action != null && !action.isBlank()) {
            list = auditLogService.getLogsByAction(action);
        } else if (userId != null && !userId.isBlank()) {
            list = auditLogService.getLogsByUser(userId);
        } else {
            list = auditLogService.getRecentLogs();
        }
        return ResponseEntity.ok(ApiResponse.ok("Audit logs fetched", list));
    }
}
