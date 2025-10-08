package dev.doomsday.suitX.model;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.CompoundIndexes;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Data;

/**
 * Mitigation entity representing risk mitigation strategies and action plans
 * Can be AI-generated or manually created
 */
@Data
@Document(collection = "mitigations")
@CompoundIndexes({
    @CompoundIndex(name = "project_status_idx", def = "{'projectId': 1, 'status': 1}")
})
public class Mitigation {
    @Id
    private String id;
    
    // Basic mitigation information
    @Indexed
    private String title;
    
    private String description;
    
    // Project and risk relationships
    @Indexed
    private String projectId; // Reference to parent project
    
    @Indexed
    private String relatedRiskId; // Reference to the risk being mitigated
    
    // Mitigation status and priority
    @Indexed
    private String status = "PLANNED"; // PLANNED, IN_PROGRESS, COMPLETED, CANCELLED
    
    private String priority = "MEDIUM"; // LOW, MEDIUM, HIGH, CRITICAL
    
    // Assignment
    @Indexed
    private String assignee; // User ID responsible for implementation
    
    private String createdBy; // User ID of creator
    
    // Timeline
    private LocalDateTime dueDate;
    private LocalDateTime startDate;
    private LocalDateTime completedAt;
    
    // Progress tracking
    private Double progressPercentage = 0.0;
    
    // Cost tracking
    private Double estimatedCost;
    private Double actualCost;
    
    // AI-related fields
    private Boolean aiGenerated = false; // Whether this mitigation was suggested by AI
    
    // Effectiveness assessment
    private String effectiveness = "NOT_ASSESSED"; // NOT_ASSESSED, LOW, MEDIUM, HIGH
    
    // Embedded action items (one-to-few relationship)
    private List<Action> actions = new ArrayList<>();
    
    // Embedded resource allocation
    private List<Resource> resources = new ArrayList<>();
    
    // Audit fields
    @CreatedDate
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    private LocalDateTime updatedAt;
    
    // Nested class for action items
    @Data
    public static class Action {
        private String actionId;
        private String description;
        private String assignedTo; // User ID
        private String status = "PENDING"; // PENDING, IN_PROGRESS, COMPLETED
        private LocalDateTime dueDate;
        private LocalDateTime completedAt;
    }
    
    // Nested class for resources
    @Data
    public static class Resource {
        private String type; // HUMAN, FINANCIAL, TECHNICAL
        private String description;
        private Double allocated; // Amount allocated (hours, dollars, etc.)
    }
    
    // Helper methods
    public boolean isCompleted() {
        return "COMPLETED".equals(status);
    }
    
    public boolean isOverdue() {
        return dueDate != null && LocalDateTime.now().isAfter(dueDate) && !isCompleted();
    }
    
    public void addAction(String description, String assignedTo, LocalDateTime dueDate) {
        if (actions == null) {
            actions = new ArrayList<>();
        }
        Action action = new Action();
        action.setActionId(java.util.UUID.randomUUID().toString());
        action.setDescription(description);
        action.setAssignedTo(assignedTo);
        action.setDueDate(dueDate);
        actions.add(action);
    }
    
    public void addResource(String type, String description, Double allocated) {
        if (resources == null) {
            resources = new ArrayList<>();
        }
        Resource resource = new Resource();
        resource.setType(type);
        resource.setDescription(description);
        resource.setAllocated(allocated);
        resources.add(resource);
    }
    
    public void updateProgress() {
        if (actions == null || actions.isEmpty()) {
            return;
        }
        long completedActions = actions.stream()
            .filter(a -> "COMPLETED".equals(a.getStatus()))
            .count();
        this.progressPercentage = (completedActions * 100.0) / actions.size();
    }
}