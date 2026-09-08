package com.hospital.queue.dto;

import java.time.Instant;

public class AuditLogDto {

    private String id;
    private String userId;
    private String userEmail;
    private String userRole;
    private String action;
    private String entityName;
    private String entityId;
    private String description;
    private String ipAddress;
    private Instant timestamp;

    public AuditLogDto() {}

    public AuditLogDto(String id, String userId, String userEmail, String userRole, String action, String entityName,
                       String entityId, String description, String ipAddress, Instant timestamp) {
        this.id = id;
        this.userId = userId;
        this.userEmail = userEmail;
        this.userRole = userRole;
        this.action = action;
        this.entityName = entityName;
        this.entityId = entityId;
        this.description = description;
        this.ipAddress = ipAddress;
        this.timestamp = timestamp;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private String id;
        private String userId;
        private String userEmail;
        private String userRole;
        private String action;
        private String entityName;
        private String entityId;
        private String description;
        private String ipAddress;
        private Instant timestamp;

        public Builder id(String id) { this.id = id; return this; }
        public Builder userId(String userId) { this.userId = userId; return this; }
        public Builder userEmail(String userEmail) { this.userEmail = userEmail; return this; }
        public Builder userRole(String userRole) { this.userRole = userRole; return this; }
        public Builder action(String action) { this.action = action; return this; }
        public Builder entityName(String entityName) { this.entityName = entityName; return this; }
        public Builder entityId(String entityId) { this.entityId = entityId; return this; }
        public Builder description(String description) { this.description = description; return this; }
        public Builder ipAddress(String ipAddress) { this.ipAddress = ipAddress; return this; }
        public Builder timestamp(Instant timestamp) { this.timestamp = timestamp; return this; }

        public AuditLogDto build() {
            return new AuditLogDto(id, userId, userEmail, userRole, action, entityName, entityId, description, ipAddress, timestamp);
        }
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getUserEmail() { return userEmail; }
    public void setUserEmail(String userEmail) { this.userEmail = userEmail; }

    public String getUserRole() { return userRole; }
    public void setUserRole(String userRole) { this.userRole = userRole; }

    public String getAction() { return action; }
    public void setAction(String action) { this.action = action; }

    public String getEntityName() { return entityName; }
    public void setEntityName(String entityName) { this.entityName = entityName; }

    public String getEntityId() { return entityId; }
    public void setEntityId(String entityId) { this.entityId = entityId; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getIpAddress() { return ipAddress; }
    public void setIpAddress(String ipAddress) { this.ipAddress = ipAddress; }

    public Instant getTimestamp() { return timestamp; }
    public void setTimestamp(Instant timestamp) { this.timestamp = timestamp; }
}
