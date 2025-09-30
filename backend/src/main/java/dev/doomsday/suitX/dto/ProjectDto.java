package dev.doomsday.suitX.dto;

import java.time.LocalDateTime;

import lombok.Data;

@Data
public class ProjectDto {
    private String id;
    private String name;
    private String description;
    private String status;
    private Double progressPercentage;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String createdBy;
    private String projectManager;
}