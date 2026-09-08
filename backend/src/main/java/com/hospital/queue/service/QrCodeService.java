package com.hospital.queue.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.hospital.queue.model.Appointment;
import com.hospital.queue.util.QRCodeGenerator;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Service
public class QrCodeService {

    private static final Logger log = LoggerFactory.getLogger(QrCodeService.class);

    private final QRCodeGenerator qrCodeGenerator;
    private final ObjectMapper objectMapper;

    public QrCodeService(QRCodeGenerator qrCodeGenerator) {
        this.qrCodeGenerator = qrCodeGenerator;
        this.objectMapper = new ObjectMapper();
    }

    public record QrResult(String qrCodeData, String qrCodeImageBase64) {}

    public QrResult generateAppointmentQr(Appointment appointment) {
        try {
            String checkInKey = UUID.randomUUID().toString().replace("-", "").substring(0, 12).toUpperCase();
            String qrPayload = "HQMS:" + appointment.getId() + ":" + appointment.getTokenNumber() + ":" + checkInKey;

            String base64Image = qrCodeGenerator.generateQRCodeBase64(qrPayload, 260, 260);

            return new QrResult(qrPayload, base64Image);
        } catch (Exception e) {
            log.error("Failed to generate QR for appointment: {}", appointment.getId(), e);
            String fallback = "HQMS:" + appointment.getId() + ":" + appointment.getTokenNumber();
            return new QrResult(fallback, null);
        }
    }
}
