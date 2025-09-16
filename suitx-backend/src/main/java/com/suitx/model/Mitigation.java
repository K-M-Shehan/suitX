package com.suitx.model;

import lombok.*;
import org.springframework.data.annotation.*;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
@Document(collection = "mitigations")
public class Mitigation {
    @Id
    private String id;

    private String riskId;
    private String action;
    private String owner;
    private String status; // Planned, In Progress, Done
    private Instant dueDate;

    @CreatedDate
    private Instant createdAt;
    @LastModifiedDate
    private Instant updatedAt;
}