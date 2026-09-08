package com.hospital.queue.model;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Document(collection = "departments")
public class Department {

    @Id
    private String id;

    @Indexed(unique = true)
    private String name;

    @Indexed(unique = true)
    private String code;

    private String description;
    private String icon;
    private String roomBlock;
    private boolean active = true;

    @CreatedDate
    private Instant createdAt;

    @LastModifiedDate
    private Instant updatedAt;

    public Department() {}

    public Department(String id, String name, String code, String description, String icon, String roomBlock, boolean active, Instant createdAt, Instant updatedAt) {
        this.id = id;
        this.name = name;
        this.code = code;
        this.description = description;
        this.icon = icon;
        this.roomBlock = roomBlock;
        this.active = active;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
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
        private Instant createdAt;
        private Instant updatedAt;

        public Builder id(String id) { this.id = id; return this; }
        public Builder name(String name) { this.name = name; return this; }
        public Builder code(String code) { this.code = code; return this; }
        public Builder description(String description) { this.description = description; return this; }
        public Builder icon(String icon) { this.icon = icon; return this; }
        public Builder roomBlock(String roomBlock) { this.roomBlock = roomBlock; return this; }
        public Builder active(boolean active) { this.active = active; return this; }
        public Builder createdAt(Instant createdAt) { this.createdAt = createdAt; return this; }
        public Builder updatedAt(Instant updatedAt) { this.updatedAt = updatedAt; return this; }

        public Department build() {
            return new Department(id, name, code, description, icon, roomBlock, active, createdAt, updatedAt);
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

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }

    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }
}
