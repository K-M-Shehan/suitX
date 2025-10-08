package dev.doomsday.suitX.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import dev.doomsday.suitX.model.Mitigation;

/**
 * Repository interface for Mitigation entity
 * Provides custom query methods for mitigation management
 */
@Repository
public interface MitigationRepository extends MongoRepository<Mitigation, String> {
    
    // Find mitigations by status
    List<Mitigation> findByStatus(String status);
    
    // Find mitigations by priority
    List<Mitigation> findByPriority(String priority);
    
    // Find mitigations assigned to a user
    List<Mitigation> findByAssignee(String assignee);
    
    // Find mitigations for a specific risk
    List<Mitigation> findByRelatedRiskId(String riskId);
    
    // Legacy method for backward compatibility
    @Deprecated
    default List<Mitigation> findByRelatedRisk(String relatedRisk) {
        return findByRelatedRiskId(relatedRisk);
    }
    
    // Find mitigations in a project
    List<Mitigation> findByProjectId(String projectId);
    
    // Find mitigations in a project with specific status
    List<Mitigation> findByProjectIdAndStatus(String projectId, String status);
    
    // Find mitigations created by a user
    List<Mitigation> findByCreatedBy(String createdBy);
    
    // Find AI-generated mitigations
    List<Mitigation> findByAiGenerated(Boolean aiGenerated);
    
    // Find AI-generated mitigations in a project
    List<Mitigation> findByProjectIdAndAiGenerated(String projectId, Boolean aiGenerated);
    
    // Find overdue mitigations
    @Query("{ 'dueDate': { $lt: ?0 }, 'status': { $ne: 'COMPLETED' } }")
    List<Mitigation> findOverdueMitigations(LocalDateTime now);
    
    // Find mitigations due soon
    @Query("{ 'dueDate': { $gte: ?0, $lte: ?1 }, 'status': { $in: ['PLANNED', 'IN_PROGRESS'] } }")
    List<Mitigation> findMitigationsDueSoon(LocalDateTime start, LocalDateTime end);
    
    // Find high priority incomplete mitigations in a project
    @Query("{ 'projectId': ?0, 'priority': { $in: ['HIGH', 'CRITICAL'] }, 'status': { $ne: 'COMPLETED' } }")
    List<Mitigation> findHighPriorityIncompleteMitigations(String projectId);
    
    // Find mitigations by effectiveness
    List<Mitigation> findByEffectiveness(String effectiveness);
    
    // Find mitigations with low effectiveness
    @Query("{ 'projectId': ?0, 'effectiveness': 'LOW', 'status': 'COMPLETED' }")
    List<Mitigation> findLowEffectivenessMitigations(String projectId);
    
    // Count mitigations by status
    Long countByStatus(String status);
    
    // Count mitigations by priority
    Long countByPriority(String priority);
    
    // Count mitigations in a project
    Long countByProjectId(String projectId);
    
    // Count mitigations for a risk
    Long countByRelatedRiskId(String riskId);
    
    // Count completed mitigations in a project
    Long countByProjectIdAndStatus(String projectId, String status);
    
    // Delete all mitigations in a project (for cascade delete)
    void deleteByProjectId(String projectId);
    
    // Delete all mitigations for a risk
    void deleteByRelatedRiskId(String riskId);
}