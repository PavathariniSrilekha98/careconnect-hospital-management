package com.hospital.queue.repository;

import com.hospital.queue.model.Consultation;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

@Repository
public interface ConsultationRepository extends MongoRepository<Consultation, String> {

    Optional<Consultation> findByAppointmentId(String appointmentId);

    List<Consultation> findByPatientIdOrderByCreatedAtDesc(String patientId);

    List<Consultation> findByPatientIdInOrderByCreatedAtDesc(Collection<String> patientIds);

    List<Consultation> findByDoctorIdOrderByCreatedAtDesc(String doctorId);

    List<Consultation> findByDoctorIdInOrderByCreatedAtDesc(Collection<String> doctorIds);

    List<Consultation> findByDoctorIdInOrDoctorNameOrderByCreatedAtDesc(Collection<String> doctorIds, String doctorName);
}
