package com.hospital.queue.model;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.CompoundIndexes;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.time.LocalDate;

@Document(collection = "appointments")
@CompoundIndexes({
        @CompoundIndex(name = "doctor_date_slot_idx", def = "{'doctorId': 1, 'appointmentDate': 1, 'timeSlot': 1}"),
        @CompoundIndex(name = "patient_date_idx", def = "{'patientId': 1, 'appointmentDate': 1}")
})
public class Appointment {

    @Id
    private String id;

    @Indexed
    private String patientId;
    private String patientName;
    private String patientEmail;
    private String patientPhone;
    private Integer patientAge;
    private String patientGender;

    @Indexed
    private String doctorId;
    private String doctorName;
    private String doctorSpecialization;
    private String doctorRoom;

    @Indexed
    private String departmentId;
    private String departmentName;
    private String departmentCode;

    @Indexed
    private LocalDate appointmentDate;
    private String timeSlot;

    @Indexed
    private String tokenNumber;
    private Integer tokenSequence;

    private PriorityLevel priority = PriorityLevel.NORMAL;
    private AppointmentStatus status = AppointmentStatus.BOOKED;

    private boolean checkedIn = false;
    private Instant checkedInTime;

    private String qrCodeData;
    private String qrCodeImageBase64;
    private String notes;

    private Instant callStartTime;
    private Instant consultationStartTime;
    private Instant consultationEndTime;

    @CreatedDate
    private Instant createdAt;

    @LastModifiedDate
    private Instant updatedAt;

    public Appointment() {}

    public Appointment(String id, String patientId, String patientName, String patientEmail, String patientPhone,
                       Integer patientAge, String patientGender, String doctorId, String doctorName,
                       String doctorSpecialization, String doctorRoom, String departmentId, String departmentName,
                       String departmentCode, LocalDate appointmentDate, String timeSlot, String tokenNumber,
                       Integer tokenSequence, PriorityLevel priority, AppointmentStatus status, boolean checkedIn,
                       Instant checkedInTime, String qrCodeData, String qrCodeImageBase64, String notes,
                       Instant callStartTime, Instant consultationStartTime, Instant consultationEndTime,
                       Instant createdAt, Instant updatedAt) {
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
        this.priority = priority != null ? priority : PriorityLevel.NORMAL;
        this.status = status != null ? status : AppointmentStatus.BOOKED;
        this.checkedIn = checkedIn;
        this.checkedInTime = checkedInTime;
        this.qrCodeData = qrCodeData;
        this.qrCodeImageBase64 = qrCodeImageBase64;
        this.notes = notes;
        this.callStartTime = callStartTime;
        this.consultationStartTime = consultationStartTime;
        this.consultationEndTime = consultationEndTime;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
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
        private PriorityLevel priority = PriorityLevel.NORMAL;
        private AppointmentStatus status = AppointmentStatus.BOOKED;
        private boolean checkedIn = false;
        private Instant checkedInTime;
        private String qrCodeData;
        private String qrCodeImageBase64;
        private String notes;
        private Instant callStartTime;
        private Instant consultationStartTime;
        private Instant consultationEndTime;
        private Instant createdAt;
        private Instant updatedAt;

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
        public Builder callStartTime(Instant callStartTime) { this.callStartTime = callStartTime; return this; }
        public Builder consultationStartTime(Instant consultationStartTime) { this.consultationStartTime = consultationStartTime; return this; }
        public Builder consultationEndTime(Instant consultationEndTime) { this.consultationEndTime = consultationEndTime; return this; }
        public Builder createdAt(Instant createdAt) { this.createdAt = createdAt; return this; }
        public Builder updatedAt(Instant updatedAt) { this.updatedAt = updatedAt; return this; }

        public Appointment build() {
            return new Appointment(id, patientId, patientName, patientEmail, patientPhone, patientAge, patientGender,
                    doctorId, doctorName, doctorSpecialization, doctorRoom, departmentId, departmentName, departmentCode,
                    appointmentDate, timeSlot, tokenNumber, tokenSequence, priority, status, checkedIn, checkedInTime,
                    qrCodeData, qrCodeImageBase64, notes, callStartTime, consultationStartTime, consultationEndTime,
                    createdAt, updatedAt);
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

    public Instant getCallStartTime() { return callStartTime; }
    public void setCallStartTime(Instant callStartTime) { this.callStartTime = callStartTime; }

    public Instant getConsultationStartTime() { return consultationStartTime; }
    public void setConsultationStartTime(Instant consultationStartTime) { this.consultationStartTime = consultationStartTime; }

    public Instant getConsultationEndTime() { return consultationEndTime; }
    public void setConsultationEndTime(Instant consultationEndTime) { this.consultationEndTime = consultationEndTime; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }

    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }
}
