package com.hospital.queue.dto;

import com.hospital.queue.model.QueueStatus;

public class QueueStatusUpdateDto {

    private QueueStatus status;
    private String notes;

    public QueueStatusUpdateDto() {}

    public QueueStatusUpdateDto(QueueStatus status, String notes) {
        this.status = status;
        this.notes = notes;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private QueueStatus status;
        private String notes;

        public Builder status(QueueStatus status) { this.status = status; return this; }
        public Builder notes(String notes) { this.notes = notes; return this; }

        public QueueStatusUpdateDto build() {
            return new QueueStatusUpdateDto(status, notes);
        }
    }

    public QueueStatus getStatus() { return status; }
    public void setStatus(QueueStatus status) { this.status = status; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
}
