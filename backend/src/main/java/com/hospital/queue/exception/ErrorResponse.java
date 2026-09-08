package com.hospital.queue.exception;

import java.time.Instant;
import java.util.List;

public class ErrorResponse {

    private boolean success;
    private int status;
    private String error;
    private String message;
    private String path;
    private List<String> validationErrors;
    private Instant timestamp = Instant.now();

    public ErrorResponse() {}

    public ErrorResponse(boolean success, int status, String error, String message, String path, List<String> validationErrors, Instant timestamp) {
        this.success = success;
        this.status = status;
        this.error = error;
        this.message = message;
        this.path = path;
        this.validationErrors = validationErrors;
        this.timestamp = timestamp != null ? timestamp : Instant.now();
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private boolean success;
        private int status;
        private String error;
        private String message;
        private String path;
        private List<String> validationErrors;
        private Instant timestamp = Instant.now();

        public Builder success(boolean success) { this.success = success; return this; }
        public Builder status(int status) { this.status = status; return this; }
        public Builder error(String error) { this.error = error; return this; }
        public Builder message(String message) { this.message = message; return this; }
        public Builder path(String path) { this.path = path; return this; }
        public Builder validationErrors(List<String> validationErrors) { this.validationErrors = validationErrors; return this; }
        public Builder timestamp(Instant timestamp) { this.timestamp = timestamp; return this; }

        public ErrorResponse build() {
            return new ErrorResponse(success, status, error, message, path, validationErrors, timestamp);
        }
    }

    public boolean isSuccess() { return success; }
    public void setSuccess(boolean success) { this.success = success; }

    public int getStatus() { return status; }
    public void setStatus(int status) { this.status = status; }

    public String getError() { return error; }
    public void setError(String error) { this.error = error; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public String getPath() { return path; }
    public void setPath(String path) { this.path = path; }

    public List<String> getValidationErrors() { return validationErrors; }
    public void setValidationErrors(List<String> validationErrors) { this.validationErrors = validationErrors; }

    public Instant getTimestamp() { return timestamp; }
    public void setTimestamp(Instant timestamp) { this.timestamp = timestamp; }
}
