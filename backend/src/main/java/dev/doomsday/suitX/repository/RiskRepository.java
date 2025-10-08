package dev.doomsday.suitX.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import dev.doomsday.suitX.model.Risk;

/**
 * Repository interface for Risk entity
 * Provides custom query methods for risk management
 */
@Repository
public interface RiskRepository extends MongoRepository<Risk, String> {
    
    // Find risks by status
    List<Risk> findByStatus(String status);
    
    // Find risks by project
    List<Risk> findByProjectId(String projectId);
    
    // Find risks by project and status
    List<Risk> findByProjectIdAndStatus(String projectId, String status);
    
    // Find risks by severity
    List<Risk> findBySeverity(String severity);
    
    // Find risks by project and severity
    List<Risk> findByProjectIdAndSeverity(String projectId, String severity);
    
    // Find risks by type
    List<Risk> findByType(String type);
    
    // Find risks assigned to a user
    List<Risk> findByAssignedTo(String userId);
    
    // Find risks created by a user
    List<Risk> findByCreatedBy(String createdBy);
    
    // Find AI-generated risks
    List<Risk> findByAiGenerated(Boolean aiGenerated);
    
    // Find AI-generated risks in a project
    List<Risk> findByProjectIdAndAiGenerated(String projectId, Boolean aiGenerated);
    
    // Find critical and high severity risks in a project
    @Query("{ 'projectId': ?0, 'severity': { $in: ['CRITICAL', 'HIGH'] }, 'status': { $ne: 'RESOLVED' } }")
    List<Risk> findCriticalRisksInProject(String projectId);
    
    // Find active risks (not resolved or accepted)
    @Query("{ 'projectId': ?0, 'status': { $in: ['IDENTIFIED', 'MONITORING', 'MITIGATED'] } }")
    List<Risk> findActiveRisksInProject(String projectId);
    
    // Find risks by score range
    @Query("{ 'riskScore': { $gte: ?0, $lte: ?1 } }")
    List<Risk> findRisksByScoreRange(Double minScore, Double maxScore);
    
    // Find high-risk items (score >= threshold)
    @Query("{ 'projectId': ?0, 'riskScore': { $gte: ?1 } }")
    List<Risk> findHighRiskItemsInProject(String projectId, Double scoreThreshold);
    
    // Count risks by status
    Long countByStatus(String status);
    
    // Count risks by severity
    Long countBySeverity(String severity);
    
    // Count risks in a project
    Long countByProjectId(String projectId);
    
    // Count active risks in a project
    @Query(value = "{ 'projectId': ?0, 'status': { $in: ['IDENTIFIED', 'MONITORING', 'MITIGATED'] } }", count = true)
    Long countActiveRisksInProject(String projectId);
    
    // Count critical risks in a project
    @Query(value = "{ 'projectId': ?0, 'severity': { $in: ['CRITICAL', 'HIGH'] }, 'status': { $ne: 'RESOLVED' } }", count = true)
    Long countCriticalRisksInProject(String projectId);
    
    // Delete all risks in a project (for cascade delete)
    void deleteByProjectId(String projectId);
}