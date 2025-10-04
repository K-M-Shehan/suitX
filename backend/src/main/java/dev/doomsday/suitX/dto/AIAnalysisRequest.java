package dev.doomsday.suitX.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AIAnalysisRequest {
    private String projectName;
    private String projectDescription;
    private String projectType;
    private String timeline;
    private String budget;
    private Integer teamSize;
    private String technologyStack;
    private String industry;
    private String specificConcerns;
    private String complexity; // LOW, MEDIUM, HIGH
}