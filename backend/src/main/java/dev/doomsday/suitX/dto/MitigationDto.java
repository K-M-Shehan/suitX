package dev.doomsday.suitX.dto;

import java.time.LocalDateTime;

import lombok.Data;

@Data
public class MitigationDto {
    private String id;
    private String title;
    private String description;
    private String status;
    private String priority;
    private String assignee;
    private String assigneeUsername; // For display purposes
    private LocalDateTime dueDate;
    private LocalDateTime startDate;
    private String relatedRisk;
    private String relatedRiskId;
    private String projectId;
    private String projectName; // For display purposes
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime completedAt;
    private String createdBy;
    private String createdByUsername; // For display purposes
    private Double progressPercentage;
    private Double estimatedCost;
    private Double actualCost;
    private Boolean aiGenerated;
    private String effectiveness;
}