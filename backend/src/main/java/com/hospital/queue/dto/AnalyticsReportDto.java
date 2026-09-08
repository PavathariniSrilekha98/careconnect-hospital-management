package com.hospital.queue.dto;

import java.util.Map;

public class AnalyticsReportDto {

    private Map<String, Long> dailyPatientTrend;
    private Map<String, Long> departmentDistribution;
    private Map<String, Long> doctorConsultationCounts;
    private Map<String, Double> departmentAvgWaitTimes;
    private Map<String, Long> hourlyTraffic;
    private Map<String, Long> statusBreakdown;
    private double overallAverageWaitMinutes;
    private double overallAverageConsultationMinutes;
    private long peakHourTotal;
    private String peakHourLabel;

    public AnalyticsReportDto() {}

    public AnalyticsReportDto(Map<String, Long> dailyPatientTrend, Map<String, Long> departmentDistribution,
                              Map<String, Long> doctorConsultationCounts, Map<String, Double> departmentAvgWaitTimes,
                              Map<String, Long> hourlyTraffic, Map<String, Long> statusBreakdown,
                              double overallAverageWaitMinutes, double overallAverageConsultationMinutes,
                              long peakHourTotal, String peakHourLabel) {
        this.dailyPatientTrend = dailyPatientTrend;
        this.departmentDistribution = departmentDistribution;
        this.doctorConsultationCounts = doctorConsultationCounts;
        this.departmentAvgWaitTimes = departmentAvgWaitTimes;
        this.hourlyTraffic = hourlyTraffic;
        this.statusBreakdown = statusBreakdown;
        this.overallAverageWaitMinutes = overallAverageWaitMinutes;
        this.overallAverageConsultationMinutes = overallAverageConsultationMinutes;
        this.peakHourTotal = peakHourTotal;
        this.peakHourLabel = peakHourLabel;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private Map<String, Long> dailyPatientTrend;
        private Map<String, Long> departmentDistribution;
        private Map<String, Long> doctorConsultationCounts;
        private Map<String, Double> departmentAvgWaitTimes;
        private Map<String, Long> hourlyTraffic;
        private Map<String, Long> statusBreakdown;
        private double overallAverageWaitMinutes;
        private double overallAverageConsultationMinutes;
        private long peakHourTotal;
        private String peakHourLabel;

        public Builder dailyPatientTrend(Map<String, Long> dailyPatientTrend) { this.dailyPatientTrend = dailyPatientTrend; return this; }
        public Builder departmentDistribution(Map<String, Long> departmentDistribution) { this.departmentDistribution = departmentDistribution; return this; }
        public Builder doctorConsultationCounts(Map<String, Long> doctorConsultationCounts) { this.doctorConsultationCounts = doctorConsultationCounts; return this; }
        public Builder departmentAvgWaitTimes(Map<String, Double> departmentAvgWaitTimes) { this.departmentAvgWaitTimes = departmentAvgWaitTimes; return this; }
        public Builder hourlyTraffic(Map<String, Long> hourlyTraffic) { this.hourlyTraffic = hourlyTraffic; return this; }
        public Builder statusBreakdown(Map<String, Long> statusBreakdown) { this.statusBreakdown = statusBreakdown; return this; }
        public Builder overallAverageWaitMinutes(double overallAverageWaitMinutes) { this.overallAverageWaitMinutes = overallAverageWaitMinutes; return this; }
        public Builder overallAverageConsultationMinutes(double overallAverageConsultationMinutes) { this.overallAverageConsultationMinutes = overallAverageConsultationMinutes; return this; }
        public Builder peakHourTotal(long peakHourTotal) { this.peakHourTotal = peakHourTotal; return this; }
        public Builder peakHourLabel(String peakHourLabel) { this.peakHourLabel = peakHourLabel; return this; }

        public AnalyticsReportDto build() {
            return new AnalyticsReportDto(dailyPatientTrend, departmentDistribution, doctorConsultationCounts,
                    departmentAvgWaitTimes, hourlyTraffic, statusBreakdown, overallAverageWaitMinutes,
                    overallAverageConsultationMinutes, peakHourTotal, peakHourLabel);
        }
    }

    public Map<String, Long> getDailyPatientTrend() { return dailyPatientTrend; }
    public void setDailyPatientTrend(Map<String, Long> dailyPatientTrend) { this.dailyPatientTrend = dailyPatientTrend; }

    public Map<String, Long> getDepartmentDistribution() { return departmentDistribution; }
    public void setDepartmentDistribution(Map<String, Long> departmentDistribution) { this.departmentDistribution = departmentDistribution; }

    public Map<String, Long> getDoctorConsultationCounts() { return doctorConsultationCounts; }
    public void setDoctorConsultationCounts(Map<String, Long> doctorConsultationCounts) { this.doctorConsultationCounts = doctorConsultationCounts; }

    public Map<String, Double> getDepartmentAvgWaitTimes() { return departmentAvgWaitTimes; }
    public void setDepartmentAvgWaitTimes(Map<String, Double> departmentAvgWaitTimes) { this.departmentAvgWaitTimes = departmentAvgWaitTimes; }

    public Map<String, Long> getHourlyTraffic() { return hourlyTraffic; }
    public void setHourlyTraffic(Map<String, Long> hourlyTraffic) { this.hourlyTraffic = hourlyTraffic; }

    public Map<String, Long> getStatusBreakdown() { return statusBreakdown; }
    public void setStatusBreakdown(Map<String, Long> statusBreakdown) { this.statusBreakdown = statusBreakdown; }

    public double getOverallAverageWaitMinutes() { return overallAverageWaitMinutes; }
    public void setOverallAverageWaitMinutes(double overallAverageWaitMinutes) { this.overallAverageWaitMinutes = overallAverageWaitMinutes; }

    public double getOverallAverageConsultationMinutes() { return overallAverageConsultationMinutes; }
    public void setOverallAverageConsultationMinutes(double overallAverageConsultationMinutes) { this.overallAverageConsultationMinutes = overallAverageConsultationMinutes; }

    public long getPeakHourTotal() { return peakHourTotal; }
    public void setPeakHourTotal(long peakHourTotal) { this.peakHourTotal = peakHourTotal; }

    public String getPeakHourLabel() { return peakHourLabel; }
    public void setPeakHourLabel(String peakHourLabel) { this.peakHourLabel = peakHourLabel; }
}
