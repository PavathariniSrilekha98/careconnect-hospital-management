package com.hospital.queue.dto;

import java.util.List;
import java.util.Map;

public class DashboardStatsDto {

    private long totalPatients;
    private long totalDoctors;
    private long totalDepartments;
    private long todayAppointments;
    private long waitingPatients;
    private long completedConsultations;
    private long cancelledAppointments;
    private long skippedPatients;
    private long activeDoctors;
    private double averageWaitTimeMinutes;
    private double averageConsultationMinutes;

    private String doctorAvailability;
    private QueueTicketDto currentServingTicket;
    private List<QueueTicketDto> liveWaitingQueue;
    private List<QueueTicketDto> recentCompleted;
    private Map<String, Long> departmentQueueCounts;

    public DashboardStatsDto() {}

    public DashboardStatsDto(long totalPatients, long totalDoctors, long totalDepartments, long todayAppointments,
                             long waitingPatients, long completedConsultations, long cancelledAppointments,
                             long skippedPatients, long activeDoctors, double averageWaitTimeMinutes,
                             double averageConsultationMinutes, String doctorAvailability,
                             QueueTicketDto currentServingTicket, List<QueueTicketDto> liveWaitingQueue,
                             List<QueueTicketDto> recentCompleted, Map<String, Long> departmentQueueCounts) {
        this.totalPatients = totalPatients;
        this.totalDoctors = totalDoctors;
        this.totalDepartments = totalDepartments;
        this.todayAppointments = todayAppointments;
        this.waitingPatients = waitingPatients;
        this.completedConsultations = completedConsultations;
        this.cancelledAppointments = cancelledAppointments;
        this.skippedPatients = skippedPatients;
        this.activeDoctors = activeDoctors;
        this.averageWaitTimeMinutes = averageWaitTimeMinutes;
        this.averageConsultationMinutes = averageConsultationMinutes;
        this.doctorAvailability = doctorAvailability;
        this.currentServingTicket = currentServingTicket;
        this.liveWaitingQueue = liveWaitingQueue;
        this.recentCompleted = recentCompleted;
        this.departmentQueueCounts = departmentQueueCounts;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private long totalPatients;
        private long totalDoctors;
        private long totalDepartments;
        private long todayAppointments;
        private long waitingPatients;
        private long completedConsultations;
        private long cancelledAppointments;
        private long skippedPatients;
        private long activeDoctors;
        private double averageWaitTimeMinutes;
        private double averageConsultationMinutes;
        private String doctorAvailability;
        private QueueTicketDto currentServingTicket;
        private List<QueueTicketDto> liveWaitingQueue;
        private List<QueueTicketDto> recentCompleted;
        private Map<String, Long> departmentQueueCounts;

        public Builder totalPatients(long totalPatients) { this.totalPatients = totalPatients; return this; }
        public Builder totalDoctors(long totalDoctors) { this.totalDoctors = totalDoctors; return this; }
        public Builder totalDepartments(long totalDepartments) { this.totalDepartments = totalDepartments; return this; }
        public Builder todayAppointments(long todayAppointments) { this.todayAppointments = todayAppointments; return this; }
        public Builder waitingPatients(long waitingPatients) { this.waitingPatients = waitingPatients; return this; }
        public Builder completedConsultations(long completedConsultations) { this.completedConsultations = completedConsultations; return this; }
        public Builder cancelledAppointments(long cancelledAppointments) { this.cancelledAppointments = cancelledAppointments; return this; }
        public Builder skippedPatients(long skippedPatients) { this.skippedPatients = skippedPatients; return this; }
        public Builder activeDoctors(long activeDoctors) { this.activeDoctors = activeDoctors; return this; }
        public Builder averageWaitTimeMinutes(double averageWaitTimeMinutes) { this.averageWaitTimeMinutes = averageWaitTimeMinutes; return this; }
        public Builder averageConsultationMinutes(double averageConsultationMinutes) { this.averageConsultationMinutes = averageConsultationMinutes; return this; }
        public Builder doctorAvailability(String doctorAvailability) { this.doctorAvailability = doctorAvailability; return this; }
        public Builder currentServingTicket(QueueTicketDto currentServingTicket) { this.currentServingTicket = currentServingTicket; return this; }
        public Builder liveWaitingQueue(List<QueueTicketDto> liveWaitingQueue) { this.liveWaitingQueue = liveWaitingQueue; return this; }
        public Builder recentCompleted(List<QueueTicketDto> recentCompleted) { this.recentCompleted = recentCompleted; return this; }
        public Builder departmentQueueCounts(Map<String, Long> departmentQueueCounts) { this.departmentQueueCounts = departmentQueueCounts; return this; }

        public DashboardStatsDto build() {
            return new DashboardStatsDto(totalPatients, totalDoctors, totalDepartments, todayAppointments,
                    waitingPatients, completedConsultations, cancelledAppointments, skippedPatients, activeDoctors,
                    averageWaitTimeMinutes, averageConsultationMinutes, doctorAvailability, currentServingTicket,
                    liveWaitingQueue, recentCompleted, departmentQueueCounts);
        }
    }

    public long getTotalPatients() { return totalPatients; }
    public void setTotalPatients(long totalPatients) { this.totalPatients = totalPatients; }

    public long getTotalDoctors() { return totalDoctors; }
    public void setTotalDoctors(long totalDoctors) { this.totalDoctors = totalDoctors; }

    public long getTotalDepartments() { return totalDepartments; }
    public void setTotalDepartments(long totalDepartments) { this.totalDepartments = totalDepartments; }

    public long getTodayAppointments() { return todayAppointments; }
    public void setTodayAppointments(long todayAppointments) { this.todayAppointments = todayAppointments; }

    public long getWaitingPatients() { return waitingPatients; }
    public void setWaitingPatients(long waitingPatients) { this.waitingPatients = waitingPatients; }

    public long getCompletedConsultations() { return completedConsultations; }
    public void setCompletedConsultations(long completedConsultations) { this.completedConsultations = completedConsultations; }

    public long getCancelledAppointments() { return cancelledAppointments; }
    public void setCancelledAppointments(long cancelledAppointments) { this.cancelledAppointments = cancelledAppointments; }

    public long getSkippedPatients() { return skippedPatients; }
    public void setSkippedPatients(long skippedPatients) { this.skippedPatients = skippedPatients; }

    public long getActiveDoctors() { return activeDoctors; }
    public void setActiveDoctors(long activeDoctors) { this.activeDoctors = activeDoctors; }

    public double getAverageWaitTimeMinutes() { return averageWaitTimeMinutes; }
    public void setAverageWaitTimeMinutes(double averageWaitTimeMinutes) { this.averageWaitTimeMinutes = averageWaitTimeMinutes; }

    public double getAverageConsultationMinutes() { return averageConsultationMinutes; }
    public void setAverageConsultationMinutes(double averageConsultationMinutes) { this.averageConsultationMinutes = averageConsultationMinutes; }

    public String getDoctorAvailability() { return doctorAvailability; }
    public void setDoctorAvailability(String doctorAvailability) { this.doctorAvailability = doctorAvailability; }

    public QueueTicketDto getCurrentServingTicket() { return currentServingTicket; }
    public void setCurrentServingTicket(QueueTicketDto currentServingTicket) { this.currentServingTicket = currentServingTicket; }

    public List<QueueTicketDto> getLiveWaitingQueue() { return liveWaitingQueue; }
    public void setLiveWaitingQueue(List<QueueTicketDto> liveWaitingQueue) { this.liveWaitingQueue = liveWaitingQueue; }

    public List<QueueTicketDto> getRecentCompleted() { return recentCompleted; }
    public void setRecentCompleted(List<QueueTicketDto> recentCompleted) { this.recentCompleted = recentCompleted; }

    public Map<String, Long> getDepartmentQueueCounts() { return departmentQueueCounts; }
    public void setDepartmentQueueCounts(Map<String, Long> departmentQueueCounts) { this.departmentQueueCounts = departmentQueueCounts; }
}
