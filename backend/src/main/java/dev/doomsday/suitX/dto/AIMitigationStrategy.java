package dev.doomsday.suitX.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AIMitigationStrategy {
    private String mitigationId;
    private String riskId;
    private String title;
    private String description;
    private String type; // PREVENTIVE, DETECTIVE, CORRECTIVE, CONTINGENT
    private String implementationEffort; // LOW, MEDIUM, HIGH
    private String costEstimate; // LOW, MEDIUM, HIGH
    private String timelineWeeks;
    private String[] successMetrics;
    private String[] responsibleRoles;
    private Double effectivenessScore;
    private String implementationSteps;
}