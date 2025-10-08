package dev.doomsday.suitX.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.CompoundIndexes;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * Task entity representing a task within a project
 * Tasks can be assigned to users and have dependencies on other tasks
 */
@Data
@Document(collection = "tasks")
@CompoundIndexes({
    @CompoundIndex(name = "project_status_idx", def = "{'projectId': 1, 'status': 1}"),
    @CompoundIndex(name = "assignee_status_idx", def = "{'assignedTo': 1, 'status': 1}")
})
public class Task {
    @Id
    private String id;
    
    // Basic task information
    @Indexed
    private String title;
    
    private String description;
    
    // Project relationship
    @Indexed
    private String projectId; // Reference to parent project
    
    // Task status and priority
    @Indexed
    private String status = "TODO"; // TODO, IN_PROGRESS, DONE, BLOCKED
    
    private String priority = "MEDIUM"; // LOW, MEDIUM, HIGH, CRITICAL
    
    // Assignment
    @Indexed
    private String assignedTo; // User ID (optional)
    
    private String createdBy; // User ID of creator
    
    // Timeline
    private LocalDateTime dueDate;
    private LocalDateTime startDate;
    private LocalDateTime completedAt;
    
    // Effort tracking
    private Double estimatedHours;
    private Double actualHours;
    
    // Dependencies
    private List<String> dependencies = new ArrayList<>(); // Task IDs this task depends on
    
    // Additional metadata
    private List<String> tags = new ArrayList<>();
    
    // Embedded attachments (one-to-few relationship)
    private List<Attachment> attachments = new ArrayList<>();
    
    // Embedded comments (one-to-few relationship)
    private List<Comment> comments = new ArrayList<>();
    
    // Audit fields
    @CreatedDate
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    private LocalDateTime updatedAt;
    
    // Nested class for attachments
    @Data
    public static class Attachment {
        private String fileName;
        private String fileUrl;
        private LocalDateTime uploadedAt;
        private String uploadedBy; // User ID
    }
    
    // Nested class for comments
    @Data
    public static class Comment {
        private String userId;
        private String text;
        private LocalDateTime createdAt;
    }
    
    // Helper methods
    public boolean isAssignedTo(String userId) {
        return assignedTo != null && assignedTo.equals(userId);
    }
    
    public boolean isCompleted() {
        return "DONE".equals(status);
    }
    
    public boolean isOverdue() {
        return dueDate != null && LocalDateTime.now().isAfter(dueDate) && !isCompleted();
    }
    
    public void addComment(String userId, String text) {
        if (comments == null) {
            comments = new ArrayList<>();
        }
        Comment comment = new Comment();
        comment.setUserId(userId);
        comment.setText(text);
        comment.setCreatedAt(LocalDateTime.now());
        comments.add(comment);
    }
    
    public void addAttachment(String fileName, String fileUrl, String uploadedBy) {
        if (attachments == null) {
            attachments = new ArrayList<>();
        }
        Attachment attachment = new Attachment();
        attachment.setFileName(fileName);
        attachment.setFileUrl(fileUrl);
        attachment.setUploadedAt(LocalDateTime.now());
        attachment.setUploadedBy(uploadedBy);
        attachments.add(attachment);
    }
}
