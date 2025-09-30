package dev.doomsday.suitX.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import dev.doomsday.suitX.model.Mitigation;

@Repository
public interface MitigationRepository extends MongoRepository<Mitigation, String> {
    List<Mitigation> findByStatus(String status);
    List<Mitigation> findByPriority(String priority);
    List<Mitigation> findByAssignee(String assignee);
    List<Mitigation> findByRelatedRisk(String relatedRisk);
    List<Mitigation> findByProjectId(String projectId);
    List<Mitigation> findByCreatedBy(String createdBy);
    Long countByStatus(String status);
    Long countByPriority(String priority);
}