package dev.doomsday.suitX.repository;

import dev.doomsday.suitX.model.Task;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Repository interface for Task entity
 * Provides custom query methods for common task operations
 */
@Repository
public interface TaskRepository extends MongoRepository<Task, String> {
    
    // Find all tasks in a project
    List<Task> findByProjectId(String projectId);
    
    // Find tasks by status
    List<Task> findByStatus(String status);
    
    // Find tasks assigned to a user
    List<Task> findByAssignedTo(String userId);
    
    // Find tasks in a project with a specific status
    List<Task> findByProjectIdAndStatus(String projectId, String status);
    
    // Find tasks assigned to a user with a specific status
    List<Task> findByAssignedToAndStatus(String userId, String status);
    
    // Find overdue tasks
    @Query("{ 'dueDate': { $lt: ?0 }, 'status': { $ne: 'DONE' } }")
    List<Task> findOverdueTasks(LocalDateTime now);
    
    // Find tasks due within a certain period
    @Query("{ 'dueDate': { $gte: ?0, $lte: ?1 }, 'status': { $ne: 'DONE' } }")
    List<Task> findTasksDueBetween(LocalDateTime start, LocalDateTime end);
    
    // Find tasks by priority
    List<Task> findByPriority(String priority);
    
    // Find high priority tasks in a project
    List<Task> findByProjectIdAndPriority(String projectId, String priority);
    
    // Find tasks created by a user
    List<Task> findByCreatedBy(String userId);
    
    // Count tasks in a project
    long countByProjectId(String projectId);
    
    // Count tasks by status in a project
    long countByProjectIdAndStatus(String projectId, String status);
    
    // Count tasks assigned to a user
    long countByAssignedTo(String userId);
    
    // Delete all tasks in a project (for cascade delete)
    void deleteByProjectId(String projectId);
}
