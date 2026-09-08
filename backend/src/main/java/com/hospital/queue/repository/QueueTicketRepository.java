package com.hospital.queue.repository;

import com.hospital.queue.model.PriorityLevel;
import com.hospital.queue.model.QueueStatus;
import com.hospital.queue.model.QueueTicket;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface QueueTicketRepository extends MongoRepository<QueueTicket, String> {

    List<QueueTicket> findByDepartmentIdAndQueueDateOrderByPriorityScoreDescTokenSequenceAsc(String departmentId, LocalDate date);

    List<QueueTicket> findByDoctorIdAndQueueDateOrderByPriorityScoreDescTokenSequenceAsc(String doctorId, LocalDate date);

    List<QueueTicket> findByQueueDate(LocalDate date);

    List<QueueTicket> findByDepartmentIdAndQueueDateAndStatus(String departmentId, LocalDate date, QueueStatus status);

    List<QueueTicket> findByDoctorIdAndQueueDateAndStatus(String doctorId, LocalDate date, QueueStatus status);

    Optional<QueueTicket> findByAppointmentId(String appointmentId);

    Optional<QueueTicket> findByTokenNumberAndQueueDate(String tokenNumber, LocalDate date);

    Optional<QueueTicket> findFirstByDoctorIdAndQueueDateAndStatusOrderByPriorityScoreDescTokenSequenceAsc(
            String doctorId, LocalDate date, QueueStatus status);

    Optional<QueueTicket> findFirstByDepartmentIdAndQueueDateAndStatusOrderByPriorityScoreDescTokenSequenceAsc(
            String departmentId, LocalDate date, QueueStatus status);

    long countByDoctorIdAndQueueDateAndStatus(String doctorId, LocalDate date, QueueStatus status);

    long countByDepartmentIdAndQueueDateAndStatus(String departmentId, LocalDate date, QueueStatus status);

    long countByQueueDateAndStatus(LocalDate date, QueueStatus status);
}
