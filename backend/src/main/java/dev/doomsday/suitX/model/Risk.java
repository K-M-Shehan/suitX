package dev.doomsday.suitX.model;

import java.time.LocalDateTime;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Data;

@Data
@Document(collection = "risks")
public class Risk {
    @Id
    private String id;
    private String title;
    private String description;
    private String type;
    private String severity; // LOW, MEDIUM, HIGH
    private String status; // ACTIVE, RESOLVED, IGNORED
    private String projectId;
    private String assignedTo;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime resolvedAt;
    private String createdBy;
}