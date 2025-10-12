package dev.doomsday.suitX.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import dev.doomsday.suitX.model.Project;

/**
 * Repository interface for Project entity
 * Provides custom query methods for project management
 */
@Repository
public interface ProjectRepository extends MongoRepository<Project, String> {
    
    // Find projects by status
    List<Project> findByStatus(String status);
    
    // Find projects owned by a user
    List<Project> findByOwnerId(String ownerId);
    
    // Find projects owned by a user with specific status
    List<Project> findByOwnerIdAndStatus(String ownerId, String status);
    
    // Find projects where user is a member
    List<Project> findByMemberIdsContaining(String userId);
    
    // Find projects where user is a member with specific status
    @Query("{ 'memberIds': ?0, 'status': ?1 }")
    List<Project> findByMemberAndStatus(String userId, String status);
    
    // Find all projects accessible to a user (as owner by username or member by userId)
    @Query("{ $or: [ { 'createdBy': ?0 }, { 'memberIds': ?1 } ] }")
    List<Project> findAllAccessibleProjects(String username, String userId);
    
    // Find active projects accessible to a user
    @Query("{ $or: [ { 'createdBy': ?0 }, { 'memberIds': ?1 } ], 'status': 'ACTIVE' }")
    List<Project> findActiveProjectsForUser(String username, String userId);
    
    // Find projects by creator (legacy support)
    List<Project> findByCreatedBy(String createdBy);
    
    // Find projects by creator and status (legacy support)
    List<Project> findByCreatedByAndStatus(String createdBy, String status);
    
    // Find projects by project manager
    List<Project> findByProjectManager(String projectManager);
    
    // Find projects by name (case-insensitive search)
    List<Project> findByNameContainingIgnoreCase(String name);
    
    // Find projects ending soon
    @Query("{ 'endDate': { $gte: ?0, $lte: ?1 }, 'status': 'ACTIVE' }")
    List<Project> findProjectsEndingSoon(LocalDateTime start, LocalDateTime end);
    
    // Find projects with progress below threshold
    @Query("{ 'progressPercentage': { $lt: ?0 }, 'status': 'ACTIVE' }")
    List<Project> findProjectsBelowProgressThreshold(Double progressThreshold);
    
    // Count projects by status
    Long countByStatus(String status);
    
    // Count projects owned by a user
    Long countByOwnerId(String ownerId);
    
    // Count projects where user is a member
    @Query(value = "{ 'memberIds': ?0 }", count = true)
    Long countProjectsWhereUserIsMember(String userId);
    
    // Check if user has access to project
    @Query(value = "{ '_id': ?0, $or: [ { 'ownerId': ?1 }, { 'memberIds': ?1 } ] }", exists = true)
    boolean userHasAccessToProject(String projectId, String userId);
}