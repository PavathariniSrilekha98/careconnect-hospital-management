package com.hospital.queue.service;

import com.hospital.queue.dto.AuditLogDto;
import com.hospital.queue.model.AuditLog;
import com.hospital.queue.repository.AuditLogRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AuditLogService {

    private static final Logger log = LoggerFactory.getLogger(AuditLogService.class);

    private final AuditLogRepository auditLogRepository;

    public AuditLogService(AuditLogRepository auditLogRepository) {
        this.auditLogRepository = auditLogRepository;
    }

    public void log(String userId, String userEmail, String userRole, String action, String entityName, String entityId, String description, String ipAddress) {
        try {
            AuditLog auditLog = AuditLog.builder()
                    .userId(userId)
                    .userEmail(userEmail)
                    .userRole(userRole)
                    .action(action)
                    .entityName(entityName)
                    .entityId(entityId)
                    .description(description)
                    .ipAddress(ipAddress)
                    .timestamp(Instant.now())
                    .build();

            auditLogRepository.save(auditLog);
            log.info("[AUDIT] Action: {}, User: {}, Entity: {} ({})", action, userEmail, entityName, entityId);
        } catch (Exception e) {
            log.error("Failed to persist audit log", e);
        }
    }

    public List<AuditLogDto> getRecentLogs() {
        return auditLogRepository.findTop100ByOrderByTimestampDesc()
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public List<AuditLogDto> getLogsByAction(String action) {
        return auditLogRepository.findByActionOrderByTimestampDesc(action)
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public List<AuditLogDto> getLogsByUser(String userId) {
        return auditLogRepository.findByUserIdOrderByTimestampDesc(userId)
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    private AuditLogDto mapToDto(AuditLog log) {
        return AuditLogDto.builder()
                .id(log.getId())
                .userId(log.getUserId())
                .userEmail(log.getUserEmail())
                .userRole(log.getUserRole())
                .action(log.getAction())
                .entityName(log.getEntityName())
                .entityId(log.getEntityId())
                .description(log.getDescription())
                .ipAddress(log.getIpAddress())
                .timestamp(log.getTimestamp())
                .build();
    }
}
