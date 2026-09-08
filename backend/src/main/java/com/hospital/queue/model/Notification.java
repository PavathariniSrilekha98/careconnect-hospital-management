package com.hospital.queue.model;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Document(collection = "notifications")
public class Notification {

    @Id
    private String id;

    @Indexed
    private String recipientId;

    private String title;
    private String message;
    private String type;

    private String referenceId;
    private String tokenNumber;
    private String roomNumber;

    private boolean isRead = false;

    @CreatedDate
    private Instant createdAt;

    public Notification() {}

    public Notification(String id, String recipientId, String title, String message, String type, String referenceId, String tokenNumber, String roomNumber, boolean isRead, Instant createdAt) {
        this.id = id;
        this.recipientId = recipientId;
        this.title = title;
        this.message = message;
        this.type = type;
        this.referenceId = referenceId;
        this.tokenNumber = tokenNumber;
        this.roomNumber = roomNumber;
        this.isRead = isRead;
        this.createdAt = createdAt;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private String id;
        private String recipientId;
        private String title;
        private String message;
        private String type;
        private String referenceId;
        private String tokenNumber;
        private String roomNumber;
        private boolean isRead = false;
        private Instant createdAt;

        public Builder id(String id) { this.id = id; return this; }
        public Builder recipientId(String recipientId) { this.recipientId = recipientId; return this; }
        public Builder title(String title) { this.title = title; return this; }
        public Builder message(String message) { this.message = message; return this; }
        public Builder type(String type) { this.type = type; return this; }
        public Builder referenceId(String referenceId) { this.referenceId = referenceId; return this; }
        public Builder tokenNumber(String tokenNumber) { this.tokenNumber = tokenNumber; return this; }
        public Builder roomNumber(String roomNumber) { this.roomNumber = roomNumber; return this; }
        public Builder isRead(boolean isRead) { this.isRead = isRead; return this; }
        public Builder createdAt(Instant createdAt) { this.createdAt = createdAt; return this; }

        public Notification build() {
            return new Notification(id, recipientId, title, message, type, referenceId, tokenNumber, roomNumber, isRead, createdAt);
        }
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getRecipientId() { return recipientId; }
    public void setRecipientId(String recipientId) { this.recipientId = recipientId; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getReferenceId() { return referenceId; }
    public void setReferenceId(String referenceId) { this.referenceId = referenceId; }

    public String getTokenNumber() { return tokenNumber; }
    public void setTokenNumber(String tokenNumber) { this.tokenNumber = tokenNumber; }

    public String getRoomNumber() { return roomNumber; }
    public void setRoomNumber(String roomNumber) { this.roomNumber = roomNumber; }

    public boolean isRead() { return isRead; }
    public void setRead(boolean read) { isRead = read; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
