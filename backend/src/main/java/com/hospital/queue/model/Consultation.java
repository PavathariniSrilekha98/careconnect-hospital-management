package com.hospital.queue.model;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Document(collection = "consultations")
public class Consultation {

    @Id
    private String id;

    @Indexed(unique = true)
    private String appointmentId;

    @Indexed
    private String patientId;
    private String patientName;

    @Indexed
    private String doctorId;
    private String doctorName;

    private String departmentName;
    private String tokenNumber;

    private String symptoms;
    private String diagnosis;
    private String clinicalNotes;
    private String vitals;

    private List<PrescriptionItem> prescriptionItems = new ArrayList<>();
    private LocalDate followUpDate;
    private Integer durationMinutes;

    @CreatedDate
    private Instant createdAt;

    @LastModifiedDate
    private Instant updatedAt;

    public Consultation() {}

    public Consultation(String id, String appointmentId, String patientId, String patientName, String doctorId,
                        String doctorName, String departmentName, String tokenNumber, String symptoms, String diagnosis,
                        String clinicalNotes, String vitals, List<PrescriptionItem> prescriptionItems, LocalDate followUpDate,
                        Integer durationMinutes, Instant createdAt, Instant updatedAt) {
        this.id = id;
        this.appointmentId = appointmentId;
        this.patientId = patientId;
        this.patientName = patientName;
        this.doctorId = doctorId;
        this.doctorName = doctorName;
        this.departmentName = departmentName;
        this.tokenNumber = tokenNumber;
        this.symptoms = symptoms;
        this.diagnosis = diagnosis;
        this.clinicalNotes = clinicalNotes;
        this.vitals = vitals;
        this.prescriptionItems = prescriptionItems != null ? prescriptionItems : new ArrayList<>();
        this.followUpDate = followUpDate;
        this.durationMinutes = durationMinutes;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private String id;
        private String appointmentId;
        private String patientId;
        private String patientName;
        private String doctorId;
        private String doctorName;
        private String departmentName;
        private String tokenNumber;
        private String symptoms;
        private String diagnosis;
        private String clinicalNotes;
        private String vitals;
        private List<PrescriptionItem> prescriptionItems = new ArrayList<>();
        private LocalDate followUpDate;
        private Integer durationMinutes;
        private Instant createdAt;
        private Instant updatedAt;

        public Builder id(String id) { this.id = id; return this; }
        public Builder appointmentId(String appointmentId) { this.appointmentId = appointmentId; return this; }
        public Builder patientId(String patientId) { this.patientId = patientId; return this; }
        public Builder patientName(String patientName) { this.patientName = patientName; return this; }
        public Builder doctorId(String doctorId) { this.doctorId = doctorId; return this; }
        public Builder doctorName(String doctorName) { this.doctorName = doctorName; return this; }
        public Builder departmentName(String departmentName) { this.departmentName = departmentName; return this; }
        public Builder tokenNumber(String tokenNumber) { this.tokenNumber = tokenNumber; return this; }
        public Builder symptoms(String symptoms) { this.symptoms = symptoms; return this; }
        public Builder diagnosis(String diagnosis) { this.diagnosis = diagnosis; return this; }
        public Builder clinicalNotes(String clinicalNotes) { this.clinicalNotes = clinicalNotes; return this; }
        public Builder vitals(String vitals) { this.vitals = vitals; return this; }
        public Builder prescriptionItems(List<PrescriptionItem> prescriptionItems) { this.prescriptionItems = prescriptionItems; return this; }
        public Builder followUpDate(LocalDate followUpDate) { this.followUpDate = followUpDate; return this; }
        public Builder durationMinutes(Integer durationMinutes) { this.durationMinutes = durationMinutes; return this; }
        public Builder createdAt(Instant createdAt) { this.createdAt = createdAt; return this; }
        public Builder updatedAt(Instant updatedAt) { this.updatedAt = updatedAt; return this; }

        public Consultation build() {
            return new Consultation(id, appointmentId, patientId, patientName, doctorId, doctorName, departmentName,
                    tokenNumber, symptoms, diagnosis, clinicalNotes, vitals, prescriptionItems, followUpDate,
                    durationMinutes, createdAt, updatedAt);
        }
    }

    public static class PrescriptionItem {
        private String medicineName;
        private String dosage;
        private String frequency;
        private String duration;
        private String instructions;

        public PrescriptionItem() {}

        public PrescriptionItem(String medicineName, String dosage, String frequency, String duration, String instructions) {
            this.medicineName = medicineName;
            this.dosage = dosage;
            this.frequency = frequency;
            this.duration = duration;
            this.instructions = instructions;
        }

        public String getMedicineName() { return medicineName; }
        public void setMedicineName(String medicineName) { this.medicineName = medicineName; }

        public String getDosage() { return dosage; }
        public void setDosage(String dosage) { this.dosage = dosage; }

        public String getFrequency() { return frequency; }
        public void setFrequency(String frequency) { this.frequency = frequency; }

        public String getDuration() { return duration; }
        public void setDuration(String duration) { this.duration = duration; }

        public String getInstructions() { return instructions; }
        public void setInstructions(String instructions) { this.instructions = instructions; }
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getAppointmentId() { return appointmentId; }
    public void setAppointmentId(String appointmentId) { this.appointmentId = appointmentId; }

    public String getPatientId() { return patientId; }
    public void setPatientId(String patientId) { this.patientId = patientId; }

    public String getPatientName() { return patientName; }
    public void setPatientName(String patientName) { this.patientName = patientName; }

    public String getDoctorId() { return doctorId; }
    public void setDoctorId(String doctorId) { this.doctorId = doctorId; }

    public String getDoctorName() { return doctorName; }
    public void setDoctorName(String doctorName) { this.doctorName = doctorName; }

    public String getDepartmentName() { return departmentName; }
    public void setDepartmentName(String departmentName) { this.departmentName = departmentName; }

    public String getTokenNumber() { return tokenNumber; }
    public void setTokenNumber(String tokenNumber) { this.tokenNumber = tokenNumber; }

    public String getSymptoms() { return symptoms; }
    public void setSymptoms(String symptoms) { this.symptoms = symptoms; }

    public String getDiagnosis() { return diagnosis; }
    public void setDiagnosis(String diagnosis) { this.diagnosis = diagnosis; }

    public String getClinicalNotes() { return clinicalNotes; }
    public void setClinicalNotes(String clinicalNotes) { this.clinicalNotes = clinicalNotes; }

    public String getVitals() { return vitals; }
    public void setVitals(String vitals) { this.vitals = vitals; }

    public List<PrescriptionItem> getPrescriptionItems() { return prescriptionItems; }
    public void setPrescriptionItems(List<PrescriptionItem> prescriptionItems) { this.prescriptionItems = prescriptionItems; }

    public LocalDate getFollowUpDate() { return followUpDate; }
    public void setFollowUpDate(LocalDate followUpDate) { this.followUpDate = followUpDate; }

    public Integer getDurationMinutes() { return durationMinutes; }
    public void setDurationMinutes(Integer durationMinutes) { this.durationMinutes = durationMinutes; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }

    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }
}
