package dev.doomsday.suitX.dto;

import lombok.Data;

@Data
public class MitigationSummaryDto {
    private Long totalMitigations;
    private Long activeMitigations;
    private Long completedMitigations;
    private Long plannedMitigations;
    private Long highPriorityMitigations;
    private Long mediumPriorityMitigations;
    private Long lowPriorityMitigations;
    private Long overdueMitigations;
}