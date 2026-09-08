package com.hospital.queue.repository;

import com.hospital.queue.model.AuditLog;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;

@Repository
public interface AuditLogRepository extends MongoRepository<AuditLog, String> {

    List<AuditLog> findTop100ByOrderByTimestampDesc();

    List<AuditLog> findByUserIdOrderByTimestampDesc(String userId);

    List<AuditLog> findByActionOrderByTimestampDesc(String action);

    List<AuditLog> findByTimestampBetweenOrderByTimestampDesc(Instant from, Instant to);
}
