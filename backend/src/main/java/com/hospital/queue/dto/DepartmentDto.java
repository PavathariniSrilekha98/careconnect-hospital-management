package com.hospital.queue.dto;

import jakarta.validation.constraints.NotBlank;
import java.time.Instant;

public class DepartmentDto {

    private String id;

    @NotBlank(message = "Department name is required")
    private String name;

    @NotBlank(message = "Department code is required")
    private String code;

    private String description;
    private String icon;
    private String roomBlock;
    private boolean active = true;
    private Long doctorCount = 0L;
    private Long activeQueueCount = 0L;
    private Instant createdAt;

    public DepartmentDto() {}

    public DepartmentDto(String id, String name, String code, String description, String icon, String roomBlock,
                         boolean active, Long doctorCount, Long activeQueueCount, Instant createdAt) {
        this.id = id;
        this.name = name;
        this.code = code;
        this.description = description;
        this.icon = icon;
        this.roomBlock = roomBlock;
        this.active = active;
        this.doctorCount = doctorCount != null ? doctorCount : 0L;
        this.activeQueueCount = activeQueueCount != null ? activeQueueCount : 0L;
        this.createdAt = createdAt;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private String id;
        private String name;
        private String code;
        private String description;
        private String icon;
        private String roomBlock;
        private boolean active = true;
        private Long doctorCount = 0L;
        private Long activeQueueCount = 0L;
        private Instant createdAt;

        public Builder id(String id) { this.id = id; return this; }
        public Builder name(String name) { this.name = name; return this; }
        public Builder code(String code) { this.code = code; return this; }
        public Builder description(String description) { this.description = description; return this; }
        public Builder icon(String icon) { this.icon = icon; return this; }
        public Builder roomBlock(String roomBlock) { this.roomBlock = roomBlock; return this; }
        public Builder active(boolean active) { this.active = active; return this; }
        public Builder doctorCount(Long doctorCount) { this.doctorCount = doctorCount; return this; }
        public Builder activeQueueCount(Long activeQueueCount) { this.activeQueueCount = activeQueueCount; return this; }
        public Builder createdAt(Instant createdAt) { this.createdAt = createdAt; return this; }

        public DepartmentDto build() {
            return new DepartmentDto(id, name, code, description, icon, roomBlock, active, doctorCount, activeQueueCount, createdAt);
        }
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getIcon() { return icon; }
    public void setIcon(String icon) { this.icon = icon; }

    public String getRoomBlock() { return roomBlock; }
    public void setRoomBlock(String roomBlock) { this.roomBlock = roomBlock; }

    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }

    public Long getDoctorCount() { return doctorCount; }
    public void setDoctorCount(Long doctorCount) { this.doctorCount = doctorCount; }

    public Long getActiveQueueCount() { return activeQueueCount; }
    public void setActiveQueueCount(Long activeQueueCount) { this.activeQueueCount = activeQueueCount; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
