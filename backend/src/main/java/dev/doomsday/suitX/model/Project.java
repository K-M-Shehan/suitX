package dev.doomsday.suitX.model;

import java.time.LocalDateTime;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Data;

@Data
@Document(collection = "projects")
public class Project {
    @Id
    private String id;
    private String name;
    private String description;
    private String status = "ACTIVE"; // ACTIVE, COMPLETED, ON_HOLD, CANCELLED, ARCHIVED
    private Double progressPercentage = 0.0;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String createdBy; // Username of the creator
    private String projectManager;
}