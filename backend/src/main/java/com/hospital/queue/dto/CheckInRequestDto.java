package com.hospital.queue.dto;

import jakarta.validation.constraints.NotBlank;

public class CheckInRequestDto {

    @NotBlank(message = "QR Code data or token identifier is required")
    private String qrCodeData;

    public CheckInRequestDto() {}

    public CheckInRequestDto(String qrCodeData) {
        this.qrCodeData = qrCodeData;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private String qrCodeData;

        public Builder qrCodeData(String qrCodeData) { this.qrCodeData = qrCodeData; return this; }

        public CheckInRequestDto build() {
            return new CheckInRequestDto(qrCodeData);
        }
    }

    public String getQrCodeData() { return qrCodeData; }
    public void setQrCodeData(String qrCodeData) { this.qrCodeData = qrCodeData; }
}
