package com.hospital.queue.model;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Document(collection = "doctors")
public class Doctor {

    @Id
    private String id;

    @Indexed(unique = true)
    private String userId;

    private String fullName;
    private String email;
    private String phoneNumber;

    @Indexed
    private String departmentId;
    private String departmentName;
    private String departmentCode;

    private String specialization;
    private String qualification;
    private String roomNumber;
    private Integer experienceYears;
    private Integer consultationDurationMinutes = 10;

    private List<String> availableDays = List.of("MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY");
    private List<String> timeSlots = List.of(
            "09:00 - 10:00",
            "10:00 - 11:00",
            "11:00 - 12:00",
            "12:00 - 13:00",
            "14:00 - 15:00",
            "15:00 - 16:00",
            "16:00 - 17:00"
    );

    private String availabilityStatus = "AVAILABLE";
    private boolean active = true;

    @CreatedDate
    private Instant createdAt;

    @LastModifiedDate
    private Instant updatedAt;

    public Doctor() {}

    public Doctor(String id, String userId, String fullName, String email, String phoneNumber, String departmentId,
                  String departmentName, String departmentCode, String specialization, String qualification,
                  String roomNumber, Integer experienceYears, Integer consultationDurationMinutes,
                  List<String> availableDays, List<String> timeSlots, String availabilityStatus, boolean active,
                  Instant createdAt, Instant updatedAt) {
        this.id = id;
        this.userId = userId;
        this.fullName = fullName;
        this.email = email;
        this.phoneNumber = phoneNumber;
        this.departmentId = departmentId;
        this.departmentName = departmentName;
        this.departmentCode = departmentCode;
        this.specialization = specialization;
        this.qualification = qualification;
        this.roomNumber = roomNumber;
        this.experienceYears = experienceYears;
        this.consultationDurationMinutes = consultationDurationMinutes;
        this.availableDays = availableDays != null ? availableDays : new ArrayList<>();
        this.timeSlots = timeSlots != null ? timeSlots : new ArrayList<>();
        this.availabilityStatus = availabilityStatus;
        this.active = active;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private String id;
        private String userId;
        private String fullName;
        private String email;
        private String phoneNumber;
        private String departmentId;
        private String departmentName;
        private String departmentCode;
        private String specialization;
        private String qualification;
        private String roomNumber;
        private Integer experienceYears;
        private Integer consultationDurationMinutes = 10;
        private List<String> availableDays = List.of("MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY");
        private List<String> timeSlots = List.of(
                "09:00 - 10:00", "10:00 - 11:00", "11:00 - 12:00", "12:00 - 13:00",
                "14:00 - 15:00", "15:00 - 16:00", "16:00 - 17:00"
        );
        private String availabilityStatus = "AVAILABLE";
        private boolean active = true;
        private Instant createdAt;
        private Instant updatedAt;

        public Builder id(String id) { this.id = id; return this; }
        public Builder userId(String userId) { this.userId = userId; return this; }
        public Builder fullName(String fullName) { this.fullName = fullName; return this; }
        public Builder email(String email) { this.email = email; return this; }
        public Builder phoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; return this; }
        public Builder departmentId(String departmentId) { this.departmentId = departmentId; return this; }
        public Builder departmentName(String departmentName) { this.departmentName = departmentName; return this; }
        public Builder departmentCode(String departmentCode) { this.departmentCode = departmentCode; return this; }
        public Builder specialization(String specialization) { this.specialization = specialization; return this; }
        public Builder qualification(String qualification) { this.qualification = qualification; return this; }
        public Builder roomNumber(String roomNumber) { this.roomNumber = roomNumber; return this; }
        public Builder experienceYears(Integer experienceYears) { this.experienceYears = experienceYears; return this; }
        public Builder consultationDurationMinutes(Integer consultationDurationMinutes) { this.consultationDurationMinutes = consultationDurationMinutes; return this; }
        public Builder availableDays(List<String> availableDays) { this.availableDays = availableDays; return this; }
        public Builder timeSlots(List<String> timeSlots) { this.timeSlots = timeSlots; return this; }
        public Builder availabilityStatus(String availabilityStatus) { this.availabilityStatus = availabilityStatus; return this; }
        public Builder active(boolean active) { this.active = active; return this; }
        public Builder createdAt(Instant createdAt) { this.createdAt = createdAt; return this; }
        public Builder updatedAt(Instant updatedAt) { this.updatedAt = updatedAt; return this; }

        public Doctor build() {
            return new Doctor(id, userId, fullName, email, phoneNumber, departmentId, departmentName, departmentCode,
                    specialization, qualification, roomNumber, experienceYears, consultationDurationMinutes,
                    availableDays, timeSlots, availabilityStatus, active, createdAt, updatedAt);
        }
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhoneNumber() { return phoneNumber; }
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }

    public String getDepartmentId() { return departmentId; }
    public void setDepartmentId(String departmentId) { this.departmentId = departmentId; }

    public String getDepartmentName() { return departmentName; }
    public void setDepartmentName(String departmentName) { this.departmentName = departmentName; }

    public String getDepartmentCode() { return departmentCode; }
    public void setDepartmentCode(String departmentCode) { this.departmentCode = departmentCode; }

    public String getSpecialization() { return specialization; }
    public void setSpecialization(String specialization) { this.specialization = specialization; }

    public String getQualification() { return qualification; }
    public void setQualification(String qualification) { this.qualification = qualification; }

    public String getRoomNumber() { return roomNumber; }
    public void setRoomNumber(String roomNumber) { this.roomNumber = roomNumber; }

    public Integer getExperienceYears() { return experienceYears; }
    public void setExperienceYears(Integer experienceYears) { this.experienceYears = experienceYears; }

    public Integer getConsultationDurationMinutes() { return consultationDurationMinutes; }
    public void setConsultationDurationMinutes(Integer consultationDurationMinutes) { this.consultationDurationMinutes = consultationDurationMinutes; }

    public List<String> getAvailableDays() { return availableDays; }
    public void setAvailableDays(List<String> availableDays) { this.availableDays = availableDays; }

    public List<String> getTimeSlots() { return timeSlots; }
    public void setTimeSlots(List<String> timeSlots) { this.timeSlots = timeSlots; }

    public String getAvailabilityStatus() { return availabilityStatus; }
    public void setAvailabilityStatus(String availabilityStatus) { this.availabilityStatus = availabilityStatus; }

    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }

    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }
}
