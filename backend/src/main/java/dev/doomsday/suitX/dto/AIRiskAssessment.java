package dev.doomsday.suitX.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AIRiskAssessment {
    private String riskId;
    private String title;
    private String description;
    private String category; // TECHNICAL, RESOURCE, TIMELINE, BUDGET, EXTERNAL
    private String priority; // LOW, MEDIUM, HIGH, CRITICAL
    private Double probability; // 0-100%
    private String impact; // LOW, MEDIUM, HIGH, CRITICAL
    private String[] earlyWarningIndicators;
    private Double confidenceScore;
    private String reasoning;
}