package com.hospital.queue.repository;

import com.hospital.queue.model.Department;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DepartmentRepository extends MongoRepository<Department, String> {

    Optional<Department> findByNameIgnoreCase(String name);

    Optional<Department> findByCodeIgnoreCase(String code);

    boolean existsByNameIgnoreCase(String name);

    boolean existsByCodeIgnoreCase(String code);

    List<Department> findByActiveTrue();
}
