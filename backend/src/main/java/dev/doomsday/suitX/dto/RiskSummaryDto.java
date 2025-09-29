package dev.doomsday.suitX.dto;

import lombok.Data;

@Data
public class RiskSummaryDto {
    private Long totalRisks;
    private Long totalProjects;
    private Long activeRisks;
    private Long resolvedRisks;
    private Long highSeverityRisks;
    private Long mediumSeverityRisks;
    private Long lowSeverityRisks;
}