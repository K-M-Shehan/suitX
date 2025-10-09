package dev.doomsday.suitX.dto;

import java.time.LocalDateTime;
import java.util.List;

import lombok.Data;

@Data
public class TaskDto {
    private String id;
    private String title;
    private String description;
    private String projectId;
    private String status; // TODO, IN_PROGRESS, DONE, BLOCKED
    private String priority; // LOW, MEDIUM, HIGH, CRITICAL
    private String assignedTo;
    private String createdBy;
    private LocalDateTime dueDate;
    private LocalDateTime startDate;
    private LocalDateTime completedAt;
    private Double estimatedHours;
    private Double actualHours;
    private List<String> dependencies;
    private List<String> tags;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
