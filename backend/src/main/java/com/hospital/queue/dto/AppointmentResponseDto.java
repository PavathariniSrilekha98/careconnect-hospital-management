package com.hospital.queue.dto;

import com.hospital.queue.model.AppointmentStatus;
import com.hospital.queue.model.PriorityLevel;
import java.time.Instant;
import java.time.LocalDate;

public class AppointmentResponseDto {

    private String id;
    private String patientId;
    private String patientName;
    private String patientEmail;
    private String patientPhone;
    private Integer patientAge;
    private String patientGender;

    private String doctorId;
    private String doctorName;
    private String doctorSpecialization;
    private String doctorRoom;

    private String departmentId;
    private String departmentName;
    private String departmentCode;

    private LocalDate appointmentDate;
    private String timeSlot;

    private String tokenNumber;
    private Integer tokenSequence;
    private PriorityLevel priority;
    private AppointmentStatus status;

    private boolean checkedIn;
    private Instant checkedInTime;

    private String qrCodeData;
    private String qrCodeImageBase64;
    private String notes;

    private Integer currentLiveTokenSequence;
    private String currentLiveTokenNumber;
    private Integer patientsAhead;
    private Integer estimatedWaitMinutes;
    private Instant createdAt;

    public AppointmentResponseDto() {}

    public AppointmentResponseDto(String id, String patientId, String patientName, String patientEmail,
                                  String patientPhone, Integer patientAge, String patientGender, String doctorId,
                                  String doctorName, String doctorSpecialization, String doctorRoom,
                                  String departmentId, String departmentName, String departmentCode,
                                  LocalDate appointmentDate, String timeSlot, String tokenNumber,
                                  Integer tokenSequence, PriorityLevel priority, AppointmentStatus status,
                                  boolean checkedIn, Instant checkedInTime, String qrCodeData,
                                  String qrCodeImageBase64, String notes, Integer currentLiveTokenSequence,
                                  String currentLiveTokenNumber, Integer patientsAhead, Integer estimatedWaitMinutes,
                                  Instant createdAt) {
        this.id = id;
        this.patientId = patientId;
        this.patientName = patientName;
        this.patientEmail = patientEmail;
        this.patientPhone = patientPhone;
        this.patientAge = patientAge;
        this.patientGender = patientGender;
        this.doctorId = doctorId;
        this.doctorName = doctorName;
        this.doctorSpecialization = doctorSpecialization;
        this.doctorRoom = doctorRoom;
        this.departmentId = departmentId;
        this.departmentName = departmentName;
        this.departmentCode = departmentCode;
        this.appointmentDate = appointmentDate;
        this.timeSlot = timeSlot;
        this.tokenNumber = tokenNumber;
        this.tokenSequence = tokenSequence;
        this.priority = priority;
        this.status = status;
        this.checkedIn = checkedIn;
        this.checkedInTime = checkedInTime;
        this.qrCodeData = qrCodeData;
        this.qrCodeImageBase64 = qrCodeImageBase64;
        this.notes = notes;
        this.currentLiveTokenSequence = currentLiveTokenSequence;
        this.currentLiveTokenNumber = currentLiveTokenNumber;
        this.patientsAhead = patientsAhead;
        this.estimatedWaitMinutes = estimatedWaitMinutes;
        this.createdAt = createdAt;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private String id;
        private String patientId;
        private String patientName;
        private String patientEmail;
        private String patientPhone;
        private Integer patientAge;
        private String patientGender;
        private String doctorId;
        private String doctorName;
        private String doctorSpecialization;
        private String doctorRoom;
        private String departmentId;
        private String departmentName;
        private String departmentCode;
        private LocalDate appointmentDate;
        private String timeSlot;
        private String tokenNumber;
        private Integer tokenSequence;
        private PriorityLevel priority;
        private AppointmentStatus status;
        private boolean checkedIn;
        private Instant checkedInTime;
        private String qrCodeData;
        private String qrCodeImageBase64;
        private String notes;
        private Integer currentLiveTokenSequence;
        private String currentLiveTokenNumber;
        private Integer patientsAhead;
        private Integer estimatedWaitMinutes;
        private Instant createdAt;

        public Builder id(String id) { this.id = id; return this; }
        public Builder patientId(String patientId) { this.patientId = patientId; return this; }
        public Builder patientName(String patientName) { this.patientName = patientName; return this; }
        public Builder patientEmail(String patientEmail) { this.patientEmail = patientEmail; return this; }
        public Builder patientPhone(String patientPhone) { this.patientPhone = patientPhone; return this; }
        public Builder patientAge(Integer patientAge) { this.patientAge = patientAge; return this; }
        public Builder patientGender(String patientGender) { this.patientGender = patientGender; return this; }
        public Builder doctorId(String doctorId) { this.doctorId = doctorId; return this; }
        public Builder doctorName(String doctorName) { this.doctorName = doctorName; return this; }
        public Builder doctorSpecialization(String doctorSpecialization) { this.doctorSpecialization = doctorSpecialization; return this; }
        public Builder doctorRoom(String doctorRoom) { this.doctorRoom = doctorRoom; return this; }
        public Builder departmentId(String departmentId) { this.departmentId = departmentId; return this; }
        public Builder departmentName(String departmentName) { this.departmentName = departmentName; return this; }
        public Builder departmentCode(String departmentCode) { this.departmentCode = departmentCode; return this; }
        public Builder appointmentDate(LocalDate appointmentDate) { this.appointmentDate = appointmentDate; return this; }
        public Builder timeSlot(String timeSlot) { this.timeSlot = timeSlot; return this; }
        public Builder tokenNumber(String tokenNumber) { this.tokenNumber = tokenNumber; return this; }
        public Builder tokenSequence(Integer tokenSequence) { this.tokenSequence = tokenSequence; return this; }
        public Builder priority(PriorityLevel priority) { this.priority = priority; return this; }
        public Builder status(AppointmentStatus status) { this.status = status; return this; }
        public Builder checkedIn(boolean checkedIn) { this.checkedIn = checkedIn; return this; }
        public Builder checkedInTime(Instant checkedInTime) { this.checkedInTime = checkedInTime; return this; }
        public Builder qrCodeData(String qrCodeData) { this.qrCodeData = qrCodeData; return this; }
        public Builder qrCodeImageBase64(String qrCodeImageBase64) { this.qrCodeImageBase64 = qrCodeImageBase64; return this; }
        public Builder notes(String notes) { this.notes = notes; return this; }
        public Builder currentLiveTokenSequence(Integer currentLiveTokenSequence) { this.currentLiveTokenSequence = currentLiveTokenSequence; return this; }
        public Builder currentLiveTokenNumber(String currentLiveTokenNumber) { this.currentLiveTokenNumber = currentLiveTokenNumber; return this; }
        public Builder patientsAhead(Integer patientsAhead) { this.patientsAhead = patientsAhead; return this; }
        public Builder estimatedWaitMinutes(Integer estimatedWaitMinutes) { this.estimatedWaitMinutes = estimatedWaitMinutes; return this; }
        public Builder createdAt(Instant createdAt) { this.createdAt = createdAt; return this; }

        public AppointmentResponseDto build() {
            return new AppointmentResponseDto(id, patientId, patientName, patientEmail, patientPhone, patientAge,
                    patientGender, doctorId, doctorName, doctorSpecialization, doctorRoom, departmentId, departmentName,
                    departmentCode, appointmentDate, timeSlot, tokenNumber, tokenSequence, priority, status, checkedIn,
                    checkedInTime, qrCodeData, qrCodeImageBase64, notes, currentLiveTokenSequence, currentLiveTokenNumber,
                    patientsAhead, estimatedWaitMinutes, createdAt);
        }
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getPatientId() { return patientId; }
    public void setPatientId(String patientId) { this.patientId = patientId; }

    public String getPatientName() { return patientName; }
    public void setPatientName(String patientName) { this.patientName = patientName; }

    public String getPatientEmail() { return patientEmail; }
    public void setPatientEmail(String patientEmail) { this.patientEmail = patientEmail; }

    public String getPatientPhone() { return patientPhone; }
    public void setPatientPhone(String patientPhone) { this.patientPhone = patientPhone; }

    public Integer getPatientAge() { return patientAge; }
    public void setPatientAge(Integer patientAge) { this.patientAge = patientAge; }

    public String getPatientGender() { return patientGender; }
    public void setPatientGender(String patientGender) { this.patientGender = patientGender; }

    public String getDoctorId() { return doctorId; }
    public void setDoctorId(String doctorId) { this.doctorId = doctorId; }

    public String getDoctorName() { return doctorName; }
    public void setDoctorName(String doctorName) { this.doctorName = doctorName; }

    public String getDoctorSpecialization() { return doctorSpecialization; }
    public void setDoctorSpecialization(String doctorSpecialization) { this.doctorSpecialization = doctorSpecialization; }

    public String getDoctorRoom() { return doctorRoom; }
    public void setDoctorRoom(String doctorRoom) { this.doctorRoom = doctorRoom; }

    public String getDepartmentId() { return departmentId; }
    public void setDepartmentId(String departmentId) { this.departmentId = departmentId; }

    public String getDepartmentName() { return departmentName; }
    public void setDepartmentName(String departmentName) { this.departmentName = departmentName; }

    public String getDepartmentCode() { return departmentCode; }
    public void setDepartmentCode(String departmentCode) { this.departmentCode = departmentCode; }

    public LocalDate getAppointmentDate() { return appointmentDate; }
    public void setAppointmentDate(LocalDate appointmentDate) { this.appointmentDate = appointmentDate; }

    public String getTimeSlot() { return timeSlot; }
    public void setTimeSlot(String timeSlot) { this.timeSlot = timeSlot; }

    public String getTokenNumber() { return tokenNumber; }
    public void setTokenNumber(String tokenNumber) { this.tokenNumber = tokenNumber; }

    public Integer getTokenSequence() { return tokenSequence; }
    public void setTokenSequence(Integer tokenSequence) { this.tokenSequence = tokenSequence; }

    public PriorityLevel getPriority() { return priority; }
    public void setPriority(PriorityLevel priority) { this.priority = priority; }

    public AppointmentStatus getStatus() { return status; }
    public void setStatus(AppointmentStatus status) { this.status = status; }

    public boolean isCheckedIn() { return checkedIn; }
    public void setCheckedIn(boolean checkedIn) { this.checkedIn = checkedIn; }

    public Instant getCheckedInTime() { return checkedInTime; }
    public void setCheckedInTime(Instant checkedInTime) { this.checkedInTime = checkedInTime; }

    public String getQrCodeData() { return qrCodeData; }
    public void setQrCodeData(String qrCodeData) { this.qrCodeData = qrCodeData; }

    public String getQrCodeImageBase64() { return qrCodeImageBase64; }
    public void setQrCodeImageBase64(String qrCodeImageBase64) { this.qrCodeImageBase64 = qrCodeImageBase64; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public Integer getCurrentLiveTokenSequence() { return currentLiveTokenSequence; }
    public void setCurrentLiveTokenSequence(Integer currentLiveTokenSequence) { this.currentLiveTokenSequence = currentLiveTokenSequence; }

    public String getCurrentLiveTokenNumber() { return currentLiveTokenNumber; }
    public void setCurrentLiveTokenNumber(String currentLiveTokenNumber) { this.currentLiveTokenNumber = currentLiveTokenNumber; }

    public Integer getPatientsAhead() { return patientsAhead; }
    public void setPatientsAhead(Integer patientsAhead) { this.patientsAhead = patientsAhead; }

    public Integer getEstimatedWaitMinutes() { return estimatedWaitMinutes; }
    public void setEstimatedWaitMinutes(Integer estimatedWaitMinutes) { this.estimatedWaitMinutes = estimatedWaitMinutes; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
