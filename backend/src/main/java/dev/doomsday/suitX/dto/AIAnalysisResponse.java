package dev.doomsday.suitX.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AIAnalysisResponse {
    private String analysisId;
    private String projectName;
    private List<AIRiskAssessment> identifiedRisks;
    private List<AIMitigationStrategy> suggestedMitigations;
    private AIProjectInsights projectInsights;
    private Double confidenceScore;
    private String analysisTimestamp;
    private String status; // SUCCESS, PARTIAL, ERROR
}