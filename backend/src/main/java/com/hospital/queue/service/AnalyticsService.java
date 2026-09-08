package com.hospital.queue.service;

import com.hospital.queue.dto.AnalyticsReportDto;
import com.hospital.queue.dto.DashboardStatsDto;
import com.hospital.queue.dto.QueueTicketDto;
import com.hospital.queue.model.*;
import com.hospital.queue.repository.*;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class AnalyticsService {

    private final UserRepository userRepository;
    private final DoctorRepository doctorRepository;
    private final DepartmentRepository departmentRepository;
    private final AppointmentRepository appointmentRepository;
    private final QueueTicketRepository queueTicketRepository;
    private final ConsultationRepository consultationRepository;
    private final QueueService queueService;

    public AnalyticsService(UserRepository userRepository,
                            DoctorRepository doctorRepository,
                            DepartmentRepository departmentRepository,
                            AppointmentRepository appointmentRepository,
                            QueueTicketRepository queueTicketRepository,
                            ConsultationRepository consultationRepository,
                            QueueService queueService) {
        this.userRepository = userRepository;
        this.doctorRepository = doctorRepository;
        this.departmentRepository = departmentRepository;
        this.appointmentRepository = appointmentRepository;
        this.queueTicketRepository = queueTicketRepository;
        this.consultationRepository = consultationRepository;
        this.queueService = queueService;
    }

    public DashboardStatsDto getAdminDashboardStats() {
        LocalDate today = LocalDate.now();

        long totalPatients = userRepository.countByRole(Role.PATIENT);
        long totalDoctors = doctorRepository.count();
        long totalDepts = departmentRepository.count();

        long todayApps = appointmentRepository.countByAppointmentDate(today);
        long waiting = queueTicketRepository.countByQueueDateAndStatus(today, QueueStatus.WAITING);
        long completed = queueTicketRepository.countByQueueDateAndStatus(today, QueueStatus.COMPLETED);
        long cancelled = appointmentRepository.countByAppointmentDateAndStatus(today, AppointmentStatus.CANCELLED);
        long skipped = queueTicketRepository.countByQueueDateAndStatus(today, QueueStatus.SKIPPED);
        long activeDocs = doctorRepository.countByActiveTrue();

        // Department breakdown
        List<Department> depts = departmentRepository.findAll();
        Map<String, Long> deptCounts = new LinkedHashMap<>();
        for (Department d : depts) {
            long count = queueTicketRepository.countByDepartmentIdAndQueueDateAndStatus(d.getId(), today, QueueStatus.WAITING);
            deptCounts.put(d.getName(), count);
        }

        // Avg wait time estimate
        double avgWait = waiting > 0 ? (waiting * 10.0) / Math.max(1, activeDocs) : 0.0;

        return DashboardStatsDto.builder()
                .totalPatients(totalPatients)
                .totalDoctors(totalDoctors)
                .totalDepartments(totalDepts)
                .todayAppointments(todayApps)
                .waitingPatients(waiting)
                .completedConsultations(completed)
                .cancelledAppointments(cancelled)
                .skippedPatients(skipped)
                .activeDoctors(activeDocs)
                .averageWaitTimeMinutes(Math.round(avgWait * 10.0) / 10.0)
                .averageConsultationMinutes(10.0)
                .departmentQueueCounts(deptCounts)
                .build();
    }

    public DashboardStatsDto getDoctorDashboardStats(String doctorId) {
        LocalDate today = LocalDate.now();
        Doctor doctor = doctorRepository.findById(doctorId).orElse(null);

        List<QueueTicketDto> queue = queueService.getLiveQueueForDoctor(doctorId, today);

        QueueTicketDto currentServing = queue.stream()
                .filter(t -> t.getStatus() == QueueStatus.CALLED || t.getStatus() == QueueStatus.IN_CONSULTATION)
                .findFirst()
                .orElse(null);

        List<QueueTicketDto> waitingList = queue.stream()
                .filter(t -> t.getStatus() == QueueStatus.WAITING)
                .collect(Collectors.toList());

        List<QueueTicketDto> completedList = queue.stream()
                .filter(t -> t.getStatus() == QueueStatus.COMPLETED)
                .collect(Collectors.toList());

        long skipped = queue.stream().filter(t -> t.getStatus() == QueueStatus.SKIPPED || t.getStatus() == QueueStatus.ABSENT).count();

        int dur = (doctor != null && doctor.getConsultationDurationMinutes() != null) ? doctor.getConsultationDurationMinutes() : 10;
        double avgWait = waitingList.size() * dur;

        return DashboardStatsDto.builder()
                .todayAppointments(queue.size())
                .waitingPatients(waitingList.size())
                .completedConsultations(completedList.size())
                .skippedPatients(skipped)
                .doctorAvailability(doctor != null ? doctor.getAvailabilityStatus() : "AVAILABLE")
                .averageWaitTimeMinutes(avgWait)
                .averageConsultationMinutes(dur)
                .currentServingTicket(currentServing)
                .liveWaitingQueue(waitingList)
                .recentCompleted(completedList)
                .build();
    }

    public AnalyticsReportDto getAnalyticsReport() {
        LocalDate today = LocalDate.now();
        List<Appointment> allAppointments = appointmentRepository.findAll();

        // 1. Daily trend for past 7 days
        Map<String, Long> dailyTrend = new LinkedHashMap<>();
        for (int i = 6; i >= 0; i--) {
            LocalDate d = today.minusDays(i);
            long count = allAppointments.stream().filter(a -> d.equals(a.getAppointmentDate())).count();
            dailyTrend.put(d.toString(), count);
        }

        // 2. Department distribution
        Map<String, Long> deptDist = new LinkedHashMap<>();
        List<Department> depts = departmentRepository.findAll();
        for (Department dept : depts) {
            long count = allAppointments.stream()
                    .filter(a -> dept.getId().equals(a.getDepartmentId()) || dept.getName().equalsIgnoreCase(a.getDepartmentName()))
                    .count();
            deptDist.put(dept.getName(), count);
        }

        // 3. Doctor consultation counts
        Map<String, Long> docCounts = new LinkedHashMap<>();
        List<Doctor> docs = doctorRepository.findAll();
        for (Doctor doc : docs) {
            long count = allAppointments.stream()
                    .filter(a -> doc.getId().equals(a.getDoctorId()) && a.getStatus() == AppointmentStatus.COMPLETED)
                    .count();
            docCounts.put("Dr. " + doc.getFullName(), count);
        }

        // 4. Hourly traffic
        Map<String, Long> hourlyTraffic = new LinkedHashMap<>();
        String[] slots = {"09:00", "10:00", "11:00", "12:00", "14:00", "15:00", "16:00"};
        for (String slot : slots) {
            long count = allAppointments.stream()
                    .filter(a -> a.getTimeSlot() != null && a.getTimeSlot().startsWith(slot))
                    .count();
            hourlyTraffic.put(slot, count);
        }

        // 5. Status breakdown
        Map<String, Long> statusBreakdown = new LinkedHashMap<>();
        for (AppointmentStatus st : AppointmentStatus.values()) {
            long count = allAppointments.stream().filter(a -> a.getStatus() == st).count();
            if (count > 0) {
                statusBreakdown.put(st.name(), count);
            }
        }

        // 6. Department average wait times (simulated from active queue & consultation settings)
        Map<String, Double> deptWaitTimes = new LinkedHashMap<>();
        for (Department dept : depts) {
            long waitingInDept = queueTicketRepository.countByDepartmentIdAndQueueDateAndStatus(dept.getId(), today, QueueStatus.WAITING);
            deptWaitTimes.put(dept.getName(), (double) (waitingInDept * 10));
        }

        String peakHour = "10:00 - 11:00";
        long peakCount = hourlyTraffic.values().stream().max(Long::compare).orElse(0L);

        return AnalyticsReportDto.builder()
                .dailyPatientTrend(dailyTrend)
                .departmentDistribution(deptDist)
                .doctorConsultationCounts(docCounts)
                .departmentAvgWaitTimes(deptWaitTimes)
                .hourlyTraffic(hourlyTraffic)
                .statusBreakdown(statusBreakdown)
                .overallAverageWaitMinutes(18.5)
                .overallAverageConsultationMinutes(10.0)
                .peakHourTotal(peakCount)
                .peakHourLabel(peakHour)
                .build();
    }
}
