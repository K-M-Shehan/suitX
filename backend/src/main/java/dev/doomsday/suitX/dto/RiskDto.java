package dev.doomsday.suitX.dto;

import java.time.LocalDateTime;

import lombok.Data;

@Data
public class RiskDto {
    private String id;
    private String title;
    private String description;
    private String type;
    private String severity;
    private String likelihood;
    private Double riskScore;
    private String status;
    private String projectId;
    private String assignedTo;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime resolvedAt;
    private String createdBy;
}