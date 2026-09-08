package com.hospital.queue.repository;

import com.hospital.queue.model.Appointment;
import com.hospital.queue.model.AppointmentStatus;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface AppointmentRepository extends MongoRepository<Appointment, String> {

    List<Appointment> findByPatientIdOrderByAppointmentDateDesc(String patientId);

    List<Appointment> findByPatientIdAndStatus(String patientId, AppointmentStatus status);

    List<Appointment> findByDoctorIdAndAppointmentDate(String doctorId, LocalDate date);

    List<Appointment> findByDoctorIdAndAppointmentDateOrderByTokenSequenceAsc(String doctorId, LocalDate date);

    List<Appointment> findByDepartmentIdAndAppointmentDate(String departmentId, LocalDate date);

    List<Appointment> findByAppointmentDate(LocalDate date);

    Optional<Appointment> findByTokenNumberAndAppointmentDate(String tokenNumber, LocalDate date);

    Optional<Appointment> findByQrCodeData(String qrCodeData);

    long countByAppointmentDateAndStatus(LocalDate date, AppointmentStatus status);

    long countByDoctorIdAndAppointmentDateAndStatus(String doctorId, LocalDate date, AppointmentStatus status);

    List<Appointment> findByDoctorIdAndAppointmentDateAndStatusNot(String doctorId, LocalDate date, AppointmentStatus status);

    boolean existsByDoctorIdAndAppointmentDateAndTimeSlotAndStatusNot(String doctorId, LocalDate date, String timeSlot, AppointmentStatus status);

    long countByAppointmentDate(LocalDate date);
}
