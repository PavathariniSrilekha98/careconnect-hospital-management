package com.hospital.queue.dto;

import com.hospital.queue.model.PriorityLevel;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

public class AppointmentRequestDto {

    @NotBlank(message = "Department ID is required")
    private String departmentId;

    @NotBlank(message = "Doctor ID is required")
    private String doctorId;

    @NotNull(message = "Appointment date is required")
    private LocalDate appointmentDate;

    @NotBlank(message = "Time slot is required")
    private String timeSlot;

    private String notes;
    private String symptoms;
    private String reasonForVisit;
    private PriorityLevel priority = PriorityLevel.NORMAL;

    public AppointmentRequestDto() {}

    public AppointmentRequestDto(String departmentId, String doctorId, LocalDate appointmentDate, String timeSlot, String notes, PriorityLevel priority) {
        this.departmentId = departmentId;
        this.doctorId = doctorId;
        this.appointmentDate = appointmentDate;
        this.timeSlot = timeSlot;
        this.notes = notes;
        this.priority = priority != null ? priority : PriorityLevel.NORMAL;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private String departmentId;
        private String doctorId;
        private LocalDate appointmentDate;
        private String timeSlot;
        private String notes;
        private String symptoms;
        private String reasonForVisit;
        private PriorityLevel priority = PriorityLevel.NORMAL;

        public Builder departmentId(String departmentId) { this.departmentId = departmentId; return this; }
        public Builder doctorId(String doctorId) { this.doctorId = doctorId; return this; }
        public Builder appointmentDate(LocalDate appointmentDate) { this.appointmentDate = appointmentDate; return this; }
        public Builder timeSlot(String timeSlot) { this.timeSlot = timeSlot; return this; }
        public Builder notes(String notes) { this.notes = notes; return this; }
        public Builder symptoms(String symptoms) { this.symptoms = symptoms; return this; }
        public Builder reasonForVisit(String reasonForVisit) { this.reasonForVisit = reasonForVisit; return this; }
        public Builder priority(PriorityLevel priority) { this.priority = priority; return this; }

        public AppointmentRequestDto build() {
            AppointmentRequestDto dto = new AppointmentRequestDto(departmentId, doctorId, appointmentDate, timeSlot, notes, priority);
            dto.setSymptoms(symptoms);
            dto.setReasonForVisit(reasonForVisit);
            return dto;
        }
    }

    public String getDepartmentId() { return departmentId; }
    public void setDepartmentId(String departmentId) { this.departmentId = departmentId; }

    public String getDoctorId() { return doctorId; }
    public void setDoctorId(String doctorId) { this.doctorId = doctorId; }

    public LocalDate getAppointmentDate() { return appointmentDate; }
    public void setAppointmentDate(LocalDate appointmentDate) { this.appointmentDate = appointmentDate; }

    public String getTimeSlot() { return timeSlot; }
    public void setTimeSlot(String timeSlot) { this.timeSlot = timeSlot; }

    public String getNotes() {
        if (notes != null && !notes.isBlank()) return notes;
        if (symptoms != null && !symptoms.isBlank()) return symptoms;
        if (reasonForVisit != null && !reasonForVisit.isBlank()) return reasonForVisit;
        return "";
    }
    public void setNotes(String notes) { this.notes = notes; }

    public String getSymptoms() { return symptoms; }
    public void setSymptoms(String symptoms) { this.symptoms = symptoms; }

    public String getReasonForVisit() { return reasonForVisit; }
    public void setReasonForVisit(String reasonForVisit) { this.reasonForVisit = reasonForVisit; }

    public PriorityLevel getPriority() { return priority != null ? priority : PriorityLevel.NORMAL; }
    public void setPriority(PriorityLevel priority) { this.priority = priority != null ? priority : PriorityLevel.NORMAL; }
}
