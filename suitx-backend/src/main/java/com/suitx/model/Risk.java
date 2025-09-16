package com.suitx.model;

import lombok.*;
import org.springframework.data.annotation.*;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
@Document(collection = "risks")
public class Risk {
    @Id
    private String id;

    private String projectId;
    private String title;
    private String description;

    private String category;     // Schedule, Budget, Scope, Quality...
    private int likelihood;      // 1..5
    private int impact;          // 1..5
    private String status;       // Open, Mitigating, Closed

    @CreatedDate
    private Instant createdAt;
    @LastModifiedDate
    private Instant updatedAt;

    public int getSeverityScore() {
        return likelihood * impact; // simple baseline
    }
}