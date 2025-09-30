package dev.doomsday.suitX.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import dev.doomsday.suitX.model.Risk;

@Repository
public interface RiskRepository extends MongoRepository<Risk, String> {
    List<Risk> findByStatus(String status);
    List<Risk> findByProjectId(String projectId);
    List<Risk> findBySeverity(String severity);
    List<Risk> findByType(String type);
    List<Risk> findByCreatedBy(String createdBy);
    Long countByStatus(String status);
    Long countBySeverity(String severity);
}