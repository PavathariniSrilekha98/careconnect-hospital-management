package com.hospital.queue.websocket;

import java.time.Instant;

public class WebSocketMessage<T> {

    private String type;
    private String departmentId;
    private String doctorId;
    private String tokenNumber;
    private String roomNumber;
    private String message;
    private T payload;
    private Instant timestamp = Instant.now();

    public WebSocketMessage() {}

    public WebSocketMessage(String type, String departmentId, String doctorId, String tokenNumber,
                            String roomNumber, String message, T payload, Instant timestamp) {
        this.type = type;
        this.departmentId = departmentId;
        this.doctorId = doctorId;
        this.tokenNumber = tokenNumber;
        this.roomNumber = roomNumber;
        this.message = message;
        this.payload = payload;
        this.timestamp = timestamp != null ? timestamp : Instant.now();
    }

    public static <T> Builder<T> builder() {
        return new Builder<>();
    }

    public static class Builder<T> {
        private String type;
        private String departmentId;
        private String doctorId;
        private String tokenNumber;
        private String roomNumber;
        private String message;
        private T payload;
        private Instant timestamp = Instant.now();

        public Builder<T> type(String type) { this.type = type; return this; }
        public Builder<T> departmentId(String departmentId) { this.departmentId = departmentId; return this; }
        public Builder<T> doctorId(String doctorId) { this.doctorId = doctorId; return this; }
        public Builder<T> tokenNumber(String tokenNumber) { this.tokenNumber = tokenNumber; return this; }
        public Builder<T> roomNumber(String roomNumber) { this.roomNumber = roomNumber; return this; }
        public Builder<T> message(String message) { this.message = message; return this; }
        public Builder<T> payload(T payload) { this.payload = payload; return this; }
        public Builder<T> timestamp(Instant timestamp) { this.timestamp = timestamp; return this; }

        public WebSocketMessage<T> build() {
            return new WebSocketMessage<>(type, departmentId, doctorId, tokenNumber, roomNumber, message, payload, timestamp);
        }
    }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getDepartmentId() { return departmentId; }
    public void setDepartmentId(String departmentId) { this.departmentId = departmentId; }

    public String getDoctorId() { return doctorId; }
    public void setDoctorId(String doctorId) { this.doctorId = doctorId; }

    public String getTokenNumber() { return tokenNumber; }
    public void setTokenNumber(String tokenNumber) { this.tokenNumber = tokenNumber; }

    public String getRoomNumber() { return roomNumber; }
    public void setRoomNumber(String roomNumber) { this.roomNumber = roomNumber; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public T getPayload() { return payload; }
    public void setPayload(T payload) { this.payload = payload; }

    public Instant getTimestamp() { return timestamp; }
    public void setTimestamp(Instant timestamp) { this.timestamp = timestamp; }
}
