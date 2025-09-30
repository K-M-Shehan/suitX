package dev.doomsday.suitX.model;

import java.time.LocalDate;
import java.time.LocalDateTime;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Data;

@Data
@Document(collection = "mitigations")
public class Mitigation {
    @Id
    private String id;
    private String title;
    private String description;
    private String status; // ACTIVE, COMPLETED, PLANNED
    private String priority; // LOW, MEDIUM, HIGH
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