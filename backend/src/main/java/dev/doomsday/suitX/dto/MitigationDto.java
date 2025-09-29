package dev.doomsday.suitX.dto;

import java.time.LocalDate;
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
    private LocalDate dueDate;
    private String relatedRisk;
    private String projectId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime completedAt;
    private String createdBy;
    private Double progressPercentage;
}