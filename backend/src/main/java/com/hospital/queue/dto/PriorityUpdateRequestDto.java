package com.hospital.queue.dto;

import com.hospital.queue.model.PriorityLevel;
import jakarta.validation.constraints.NotNull;

public class PriorityUpdateRequestDto {

    @NotNull(message = "Priority level is required")
    private PriorityLevel priority;

    private String reason;

    public PriorityUpdateRequestDto() {}

    public PriorityUpdateRequestDto(PriorityLevel priority, String reason) {
        this.priority = priority;
        this.reason = reason;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private PriorityLevel priority;
        private String reason;

        public Builder priority(PriorityLevel priority) { this.priority = priority; return this; }
        public Builder reason(String reason) { this.reason = reason; return this; }

        public PriorityUpdateRequestDto build() {
            return new PriorityUpdateRequestDto(priority, reason);
        }
    }

    public PriorityLevel getPriority() { return priority; }
    public void setPriority(PriorityLevel priority) { this.priority = priority; }

    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }
}
