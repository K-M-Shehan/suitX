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
 * Project entity representing a project in the system
 * Supports owner-member relationships and links to tasks and risks
 */
@Data
@Document(collection = "projects")
@CompoundIndexes({
    @CompoundIndex(name = "owner_status_idx", def = "{'ownerId': 1, 'status': 1}"),
    @CompoundIndex(name = "member_status_idx", def = "{'memberIds': 1, 'status': 1}")
})
public class Project {
    @Id
    private String id;
    
    // Basic project information
    @Indexed
    private String name;
    
    private String description;
    
    @Indexed
    private String status = "ACTIVE"; // ACTIVE, COMPLETED, ON_HOLD, CANCELLED, ARCHIVED
    
    // Owner and team relationships
    @Indexed
    private String ownerId; // User ID of the project creator/owner
    
    private String projectManager; // User ID of project manager (can be different from owner)
    
    @Indexed
    private List<String> memberIds = new ArrayList<>(); // List of member user IDs
    
    // Associated entities (referenced by ID)
    private List<String> taskIds = new ArrayList<>();
    private List<String> riskIds = new ArrayList<>();
    
    // Project timeline
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    
    // Project metrics
    private Double progressPercentage = 0.0;
    private Double budget;
    
    // Additional metadata
    private List<String> tags = new ArrayList<>();
    
    // Audit fields
    @CreatedDate
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    private LocalDateTime updatedAt;
    
    private String createdBy; // User ID of creator
    
    // Helper methods
    public boolean isOwner(String userId) {
        return ownerId != null && ownerId.equals(userId);
    }
    
    public boolean isMember(String userId) {
        return memberIds != null && memberIds.contains(userId);
    }
    
    public boolean hasAccess(String userId) {
        return isOwner(userId) || isMember(userId);
    }
    
    public void addMember(String userId) {
        if (memberIds == null) {
            memberIds = new ArrayList<>();
        }
        if (!memberIds.contains(userId)) {
            memberIds.add(userId);
        }
    }
    
    public void removeMember(String userId) {
        if (memberIds != null) {
            memberIds.remove(userId);
        }
    }
    
    public void addTask(String taskId) {
        if (taskIds == null) {
            taskIds = new ArrayList<>();
        }
        if (!taskIds.contains(taskId)) {
            taskIds.add(taskId);
        }
    }
    
    public void addRisk(String riskId) {
        if (riskIds == null) {
            riskIds = new ArrayList<>();
        }
        if (!riskIds.contains(riskId)) {
            riskIds.add(riskId);
        }
    }
}