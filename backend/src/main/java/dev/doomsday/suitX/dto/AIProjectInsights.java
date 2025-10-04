package dev.doomsday.suitX.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AIProjectInsights {
    private String overallRiskLevel; // LOW, MEDIUM, HIGH, CRITICAL
    private String[] keyStrengths;
    private String[] primaryConcerns;
    private String[] recommendations;
    private Integer totalRisksIdentified;
    private String riskDistribution; // JSON string with risk category counts
    private String complexity;
    private String successProbability;
}