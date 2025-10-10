package dev.doomsday.suitX.model;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.CompoundIndexes;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Data;

/**
 * Notification entity for user notifications
 * Supports various notification types with flexible metadata
 * Includes TTL index for auto-deletion of old notifications
 */
@Data
@Document(collection = "notifications")
@CompoundIndexes({
    @CompoundIndex(name = "user_read_created_idx", def = "{'userId': 1, 'isRead': 1, 'createdAt': -1}")
})
public class Notification {
    @Id
    private String id;
    
    // User relationship
    @Indexed
    private String userId; // User who receives this notification
    
    // Notification type - determines how the notification should be displayed/handled
    private String type; // TASK_ASSIGNED, TASK_COMPLETED, RISK_DETECTED, RISK_UPDATED, 
                        // PROJECT_INVITED, MITIGATION_ASSIGNED, COMMENT_ADDED, DEADLINE_APPROACHING
    
    // Notification content
    private String title;
    private String message;
    
    // Related entity information
    private String relatedEntityType; // PROJECT, TASK, RISK, MITIGATION
    
    @Indexed
    private String relatedEntityId; // ID of the related entity
    
    // Frontend navigation
    private String actionUrl; // Route to navigate to when notification is clicked
    
    // Status
    @Indexed
    private Boolean isRead = false;
    
    private String priority = "MEDIUM"; // LOW, MEDIUM, HIGH
    
    // Flexible metadata for different notification types
    private Map<String, Object> metadata = new HashMap<>();
    
    // Timestamps
    @CreatedDate
    @Indexed
    private LocalDateTime createdAt;
    
    private LocalDateTime readAt;
    
    // TTL index - notifications expire after 90 days (auto-deleted by MongoDB)
    // Note: TTL indexes should be created manually or via configuration
    // db.notifications.createIndex({ "expiresAt": 1 }, { expireAfterSeconds: 0 })
    @Indexed
    private LocalDateTime expiresAt;
    
    // Helper methods
    public void markAsRead() {
        this.isRead = true;
        this.readAt = LocalDateTime.now();
    }
    
    public boolean isUnread() {
        return !isRead;
    }
    
    public void addMetadata(String key, Object value) {
        if (metadata == null) {
            metadata = new HashMap<>();
        }
        metadata.put(key, value);
    }
    
    public Object getMetadata(String key) {
        return metadata != null ? metadata.get(key) : null;
    }
    
    // Static factory methods for common notification types
    public static Notification createTaskAssignedNotification(
            String userId, String taskId, String taskTitle, String projectName, String assignedBy) {
        Notification notification = new Notification();
        notification.setUserId(userId);
        notification.setType("TASK_ASSIGNED");
        notification.setTitle("New Task Assigned");
        notification.setMessage("You have been assigned to task: " + taskTitle);
        notification.setRelatedEntityType("TASK");
        notification.setRelatedEntityId(taskId);
        notification.setActionUrl("/tasks/" + taskId);
        notification.setPriority("MEDIUM");
        notification.addMetadata("projectName", projectName);
        notification.addMetadata("taskTitle", taskTitle);
        notification.addMetadata("assignedBy", assignedBy);
        notification.setExpiresAt(LocalDateTime.now().plusDays(90));
        return notification;
    }
    
    public static Notification createRiskDetectedNotification(
            String userId, String riskId, String riskTitle, String projectName, String severity) {
        Notification notification = new Notification();
        notification.setUserId(userId);
        notification.setType("RISK_DETECTED");
        notification.setTitle("New Risk Detected");
        notification.setMessage("A " + severity.toLowerCase() + " severity risk has been detected: " + riskTitle);
        notification.setRelatedEntityType("RISK");
        notification.setRelatedEntityId(riskId);
        notification.setActionUrl("/risks/" + riskId);
        notification.setPriority("CRITICAL".equals(severity) || "HIGH".equals(severity) ? "HIGH" : "MEDIUM");
        notification.addMetadata("projectName", projectName);
        notification.addMetadata("riskTitle", riskTitle);
        notification.addMetadata("severity", severity);
        notification.setExpiresAt(LocalDateTime.now().plusDays(90));
        return notification;
    }
    
    public static Notification createProjectInvitedNotification(
            String userId, String projectId, String projectName, String invitedBy) {
        Notification notification = new Notification();
        notification.setUserId(userId);
        notification.setType("PROJECT_INVITED");
        notification.setTitle("Project Invitation");
        notification.setMessage("You have been added to project: " + projectName);
        notification.setRelatedEntityType("PROJECT");
        notification.setRelatedEntityId(projectId);
        notification.setActionUrl("/projects/" + projectId);
        notification.setPriority("MEDIUM");
        notification.addMetadata("projectName", projectName);
        notification.addMetadata("invitedBy", invitedBy);
        notification.setExpiresAt(LocalDateTime.now().plusDays(90));
        return notification;
    }
    
    public static Notification createMitigationAssignedNotification(
            String userId, String mitigationId, String mitigationTitle, String projectName, String assignedBy) {
        Notification notification = new Notification();
        notification.setUserId(userId);
        notification.setType("MITIGATION_ASSIGNED");
        notification.setTitle("Mitigation Assigned");
        notification.setMessage("You have been assigned to mitigation: " + mitigationTitle);
        notification.setRelatedEntityType("MITIGATION");
        notification.setRelatedEntityId(mitigationId);
        notification.setActionUrl("/mitigations/" + mitigationId);
        notification.setPriority("MEDIUM");
        notification.addMetadata("projectName", projectName);
        notification.addMetadata("mitigationTitle", mitigationTitle);
        notification.addMetadata("assignedBy", assignedBy);
        notification.setExpiresAt(LocalDateTime.now().plusDays(90));
        return notification;
    }
    
    public static Notification createDeadlineApproachingNotification(
            String userId, String entityType, String entityId, String entityTitle, 
            String projectName, LocalDateTime deadline) {
        Notification notification = new Notification();
        notification.setUserId(userId);
        notification.setType("DEADLINE_APPROACHING");
        notification.setTitle("Deadline Approaching");
        notification.setMessage(entityTitle + " is due soon");
        notification.setRelatedEntityType(entityType);
        notification.setRelatedEntityId(entityId);
        notification.setActionUrl("/" + entityType.toLowerCase() + "s/" + entityId);
        notification.setPriority("HIGH");
        notification.addMetadata("projectName", projectName);
        notification.addMetadata("entityTitle", entityTitle);
        notification.addMetadata("deadline", deadline.toString());
        notification.setExpiresAt(LocalDateTime.now().plusDays(90));
        return notification;
    }
}
