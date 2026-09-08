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

@Document(collection = "queue_tickets")
@CompoundIndexes({
        @CompoundIndex(name = "dept_date_status_idx", def = "{'departmentId': 1, 'queueDate': 1, 'status': 1}"),
        @CompoundIndex(name = "doc_date_status_idx", def = "{'doctorId': 1, 'queueDate': 1, 'status': 1}")
})
public class QueueTicket {

    @Id
    private String id;

    @Indexed
    private String appointmentId;

    @Indexed
    private String tokenNumber;
    private Integer tokenSequence;

    @Indexed
    private String departmentId;
    private String departmentName;
    private String departmentCode;

    @Indexed
    private String doctorId;
    private String doctorName;
    private String roomNumber;

    @Indexed
    private String patientId;
    private String patientName;
    private String patientPhone;
    private Integer patientAge;
    private String patientGender;

    private LocalDate queueDate;
    private PriorityLevel priority = PriorityLevel.NORMAL;
    private QueueStatus status = QueueStatus.WAITING;

    private Double priorityScore;
    private Integer positionInQueue;
    private Integer patientsAhead;
    private Integer estimatedWaitMinutes;

    private Instant checkInTime;
    private Instant calledTime;
    private Instant consultationStartTime;
    private Instant completedTime;

    @CreatedDate
    private Instant createdAt;

    @LastModifiedDate
    private Instant updatedAt;

    public QueueTicket() {}

    public QueueTicket(String id, String appointmentId, String tokenNumber, Integer tokenSequence, String departmentId,
                       String departmentName, String departmentCode, String doctorId, String doctorName,
                       String roomNumber, String patientId, String patientName, String patientPhone, Integer patientAge,
                       String patientGender, LocalDate queueDate, PriorityLevel priority, QueueStatus status,
                       Double priorityScore, Integer positionInQueue, Integer patientsAhead, Integer estimatedWaitMinutes,
                       Instant checkInTime, Instant calledTime, Instant consultationStartTime, Instant completedTime,
                       Instant createdAt, Instant updatedAt) {
        this.id = id;
        this.appointmentId = appointmentId;
        this.tokenNumber = tokenNumber;
        this.tokenSequence = tokenSequence;
        this.departmentId = departmentId;
        this.departmentName = departmentName;
        this.departmentCode = departmentCode;
        this.doctorId = doctorId;
        this.doctorName = doctorName;
        this.roomNumber = roomNumber;
        this.patientId = patientId;
        this.patientName = patientName;
        this.patientPhone = patientPhone;
        this.patientAge = patientAge;
        this.patientGender = patientGender;
        this.queueDate = queueDate;
        this.priority = priority != null ? priority : PriorityLevel.NORMAL;
        this.status = status != null ? status : QueueStatus.WAITING;
        this.priorityScore = priorityScore;
        this.positionInQueue = positionInQueue;
        this.patientsAhead = patientsAhead;
        this.estimatedWaitMinutes = estimatedWaitMinutes;
        this.checkInTime = checkInTime;
        this.calledTime = calledTime;
        this.consultationStartTime = consultationStartTime;
        this.completedTime = completedTime;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private String id;
        private String appointmentId;
        private String tokenNumber;
        private Integer tokenSequence;
        private String departmentId;
        private String departmentName;
        private String departmentCode;
        private String doctorId;
        private String doctorName;
        private String roomNumber;
        private String patientId;
        private String patientName;
        private String patientPhone;
        private Integer patientAge;
        private String patientGender;
        private LocalDate queueDate;
        private PriorityLevel priority = PriorityLevel.NORMAL;
        private QueueStatus status = QueueStatus.WAITING;
        private Double priorityScore;
        private Integer positionInQueue;
        private Integer patientsAhead;
        private Integer estimatedWaitMinutes;
        private Instant checkInTime;
        private Instant calledTime;
        private Instant consultationStartTime;
        private Instant completedTime;
        private Instant createdAt;
        private Instant updatedAt;

        public Builder id(String id) { this.id = id; return this; }
        public Builder appointmentId(String appointmentId) { this.appointmentId = appointmentId; return this; }
        public Builder tokenNumber(String tokenNumber) { this.tokenNumber = tokenNumber; return this; }
        public Builder tokenSequence(Integer tokenSequence) { this.tokenSequence = tokenSequence; return this; }
        public Builder departmentId(String departmentId) { this.departmentId = departmentId; return this; }
        public Builder departmentName(String departmentName) { this.departmentName = departmentName; return this; }
        public Builder departmentCode(String departmentCode) { this.departmentCode = departmentCode; return this; }
        public Builder doctorId(String doctorId) { this.doctorId = doctorId; return this; }
        public Builder doctorName(String doctorName) { this.doctorName = doctorName; return this; }
        public Builder roomNumber(String roomNumber) { this.roomNumber = roomNumber; return this; }
        public Builder patientId(String patientId) { this.patientId = patientId; return this; }
        public Builder patientName(String patientName) { this.patientName = patientName; return this; }
        public Builder patientPhone(String patientPhone) { this.patientPhone = patientPhone; return this; }
        public Builder patientAge(Integer patientAge) { this.patientAge = patientAge; return this; }
        public Builder patientGender(String patientGender) { this.patientGender = patientGender; return this; }
        public Builder queueDate(LocalDate queueDate) { this.queueDate = queueDate; return this; }
        public Builder priority(PriorityLevel priority) { this.priority = priority; return this; }
        public Builder status(QueueStatus status) { this.status = status; return this; }
        public Builder priorityScore(Double priorityScore) { this.priorityScore = priorityScore; return this; }
        public Builder positionInQueue(Integer positionInQueue) { this.positionInQueue = positionInQueue; return this; }
        public Builder patientsAhead(Integer patientsAhead) { this.patientsAhead = patientsAhead; return this; }
        public Builder estimatedWaitMinutes(Integer estimatedWaitMinutes) { this.estimatedWaitMinutes = estimatedWaitMinutes; return this; }
        public Builder checkInTime(Instant checkInTime) { this.checkInTime = checkInTime; return this; }
        public Builder calledTime(Instant calledTime) { this.calledTime = calledTime; return this; }
        public Builder consultationStartTime(Instant consultationStartTime) { this.consultationStartTime = consultationStartTime; return this; }
        public Builder completedTime(Instant completedTime) { this.completedTime = completedTime; return this; }
        public Builder createdAt(Instant createdAt) { this.createdAt = createdAt; return this; }
        public Builder updatedAt(Instant updatedAt) { this.updatedAt = updatedAt; return this; }

        public QueueTicket build() {
            return new QueueTicket(id, appointmentId, tokenNumber, tokenSequence, departmentId, departmentName,
                    departmentCode, doctorId, doctorName, roomNumber, patientId, patientName, patientPhone,
                    patientAge, patientGender, queueDate, priority, status, priorityScore, positionInQueue,
                    patientsAhead, estimatedWaitMinutes, checkInTime, calledTime, consultationStartTime,
                    completedTime, createdAt, updatedAt);
        }
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getAppointmentId() { return appointmentId; }
    public void setAppointmentId(String appointmentId) { this.appointmentId = appointmentId; }

    public String getTokenNumber() { return tokenNumber; }
    public void setTokenNumber(String tokenNumber) { this.tokenNumber = tokenNumber; }

    public Integer getTokenSequence() { return tokenSequence; }
    public void setTokenSequence(Integer tokenSequence) { this.tokenSequence = tokenSequence; }

    public String getDepartmentId() { return departmentId; }
    public void setDepartmentId(String departmentId) { this.departmentId = departmentId; }

    public String getDepartmentName() { return departmentName; }
    public void setDepartmentName(String departmentName) { this.departmentName = departmentName; }

    public String getDepartmentCode() { return departmentCode; }
    public void setDepartmentCode(String departmentCode) { this.departmentCode = departmentCode; }

    public String getDoctorId() { return doctorId; }
    public void setDoctorId(String doctorId) { this.doctorId = doctorId; }

    public String getDoctorName() { return doctorName; }
    public void setDoctorName(String doctorName) { this.doctorName = doctorName; }

    public String getRoomNumber() { return roomNumber; }
    public void setRoomNumber(String roomNumber) { this.roomNumber = roomNumber; }

    public String getPatientId() { return patientId; }
    public void setPatientId(String patientId) { this.patientId = patientId; }

    public String getPatientName() { return patientName; }
    public void setPatientName(String patientName) { this.patientName = patientName; }

    public String getPatientPhone() { return patientPhone; }
    public void setPatientPhone(String patientPhone) { this.patientPhone = patientPhone; }

    public Integer getPatientAge() { return patientAge; }
    public void setPatientAge(Integer patientAge) { this.patientAge = patientAge; }

    public String getPatientGender() { return patientGender; }
    public void setPatientGender(String patientGender) { this.patientGender = patientGender; }

    public LocalDate getQueueDate() { return queueDate; }
    public void setQueueDate(LocalDate queueDate) { this.queueDate = queueDate; }

    public PriorityLevel getPriority() { return priority; }
    public void setPriority(PriorityLevel priority) { this.priority = priority; }

    public QueueStatus getStatus() { return status; }
    public void setStatus(QueueStatus status) { this.status = status; }

    public Double getPriorityScore() { return priorityScore; }
    public void setPriorityScore(Double priorityScore) { this.priorityScore = priorityScore; }

    public Integer getPositionInQueue() { return positionInQueue; }
    public void setPositionInQueue(Integer positionInQueue) { this.positionInQueue = positionInQueue; }

    public Integer getPatientsAhead() { return patientsAhead; }
    public void setPatientsAhead(Integer patientsAhead) { this.patientsAhead = patientsAhead; }

    public Integer getEstimatedWaitMinutes() { return estimatedWaitMinutes; }
    public void setEstimatedWaitMinutes(Integer estimatedWaitMinutes) { this.estimatedWaitMinutes = estimatedWaitMinutes; }

    public Instant getCheckInTime() { return checkInTime; }
    public void setCheckInTime(Instant checkInTime) { this.checkInTime = checkInTime; }

    public Instant getCalledTime() { return calledTime; }
    public void setCalledTime(Instant calledTime) { this.calledTime = calledTime; }

    public Instant getConsultationStartTime() { return consultationStartTime; }
    public void setConsultationStartTime(Instant consultationStartTime) { this.consultationStartTime = consultationStartTime; }

    public Instant getCompletedTime() { return completedTime; }
    public void setCompletedTime(Instant completedTime) { this.completedTime = completedTime; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }

    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }
}
