package com.hospital.queue.repository;

import com.hospital.queue.model.Role;
import com.hospital.queue.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends MongoRepository<User, String> {

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    List<User> findByRole(Role role);

    List<User> findByRoleAndActive(Role role, boolean active);

    List<User> findByFullNameContainingIgnoreCase(String name);

    long countByRole(Role role);
}
