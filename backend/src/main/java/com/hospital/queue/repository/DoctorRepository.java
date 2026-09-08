package com.hospital.queue.repository;

import com.hospital.queue.model.Doctor;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DoctorRepository extends MongoRepository<Doctor, String> {

    Optional<Doctor> findByUserId(String userId);

    Optional<Doctor> findByEmail(String email);

    List<Doctor> findByDepartmentId(String departmentId);

    List<Doctor> findByDepartmentIdAndActiveTrue(String departmentId);

    List<Doctor> findByActiveTrue();

    List<Doctor> findByFullNameContainingIgnoreCaseOrSpecializationContainingIgnoreCase(String name, String specialization);

    long countByActiveTrue();
}
