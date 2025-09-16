package com.suitx.model;

import lombok.*;
import org.springframework.data.annotation.*;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
@Document(collection = "risk_updates")
public class RiskUpdate {
    @Id
    private String id;

    private String riskId;
    private String note;
    private Integer deltaScore; // optional change to severity

    @CreatedDate
    private Instant createdAt;
}