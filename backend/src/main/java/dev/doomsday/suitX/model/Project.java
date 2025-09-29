package dev.doomsday.suitX.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@Document(collection = "projects")
public class Project {
    @Id
    private String id;
    private String name;
    private String description;
    private String status = "ACTIVE"; // ACTIVE, COMPLETED, ARCHIVED
    private String createdBy; // Username of the creator
    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime updatedAt = LocalDateTime.now();
}