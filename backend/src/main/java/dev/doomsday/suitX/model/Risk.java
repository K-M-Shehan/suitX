package dev.doomsday.suitX.model;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.CompoundIndexes;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Data;

/**
 * Risk entity representing identified project risks
 * Includes AI-generated mitigation suggestions and change history
 */
@Data
@Document(collection = "risks")
@CompoundIndexes({
    @CompoundIndex(name = "project_status_idx", def = "{'projectId': 1, 'status': 1}"),
    @CompoundIndex(name = "project_severity_idx", def = "{'projectId': 1, 'severity': 1}")
})
public class Risk {
    @Id
    private String id;
    
    // Basic risk information
    @Indexed
    private String title;
    
    private String description;
    
    // Project relationship
    @Indexed
    private String projectId; // Reference to parent project
    
    // Risk classification
    private String type; // TECHNICAL, FINANCIAL, RESOURCE, SCOPE, SCHEDULE, QUALITY
    
    @Indexed
    private String severity = "MEDIUM"; // LOW, MEDIUM, HIGH, CRITICAL
    
    private String likelihood = "POSSIBLE"; // RARE, UNLIKELY, POSSIBLE, LIKELY, CERTAIN
    
    // Calculated risk score (severity × likelihood numeric values)
    private Double riskScore;
    
    // Risk status
    @Indexed
    private String status = "IDENTIFIED"; // IDENTIFIED, MONITORING, MITIGATED, RESOLVED, ACCEPTED
    
    // Assignment
    @Indexed
    private String assignedTo; // User ID responsible for monitoring/mitigation
    
    private String createdBy; // User ID of creator
    
    // AI-related fields
    @Indexed
    private Boolean aiGenerated = false; // Whether this risk was identified by AI
    
    private Double aiConfidence; // AI confidence score (0-100)
    
    // Embedded change history for audit trail
    private List<HistoryEntry> history = new ArrayList<>();
    
    // Related entities
    private List<String> relatedTaskIds = new ArrayList<>();
    private List<String> relatedMitigationIds = new ArrayList<>(); // References to separate Mitigation entities
    
    // Additional metadata
    private List<String> tags = new ArrayList<>();
    
    // Timeline
    private LocalDateTime identifiedDate;
    
    @CreatedDate
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    private LocalDateTime updatedAt;
    
    private LocalDateTime resolvedAt;
    
    // Nested class for change history
    @Data
    public static class HistoryEntry {
        private LocalDateTime timestamp;
        private String action; // STATUS_CHANGE, SEVERITY_UPDATE, ASSIGNMENT_CHANGE, etc.
        private String userId; // Who made the change
        private String previousValue;
        private String newValue;
        private String notes;
    }
    
    // Helper methods
    public void calculateRiskScore() {
        // Convert severity and likelihood to numeric values and calculate score
        int severityValue = getSeverityValue(severity);
        int likelihoodValue = getLikelihoodValue(likelihood);
        this.riskScore = (double) (severityValue * likelihoodValue);
    }
    
    private int getSeverityValue(String severity) {
        return switch (severity) {
            case "CRITICAL" -> 4;
            case "HIGH" -> 3;
            case "MEDIUM" -> 2;
            case "LOW" -> 1;
            default -> 2;
        };
    }
    
    private int getLikelihoodValue(String likelihood) {
        return switch (likelihood) {
            case "CERTAIN" -> 5;
            case "LIKELY" -> 4;
            case "POSSIBLE" -> 3;
            case "UNLIKELY" -> 2;
            case "RARE" -> 1;
            default -> 3;
        };
    }
    
    public void addHistoryEntry(String action, String userId, String previousValue, String newValue, String notes) {
        if (history == null) {
            history = new ArrayList<>();
        }
        HistoryEntry entry = new HistoryEntry();
        entry.setTimestamp(LocalDateTime.now());
        entry.setAction(action);
        entry.setUserId(userId);
        entry.setPreviousValue(previousValue);
        entry.setNewValue(newValue);
        entry.setNotes(notes);
        history.add(entry);
    }
    
    public void addRelatedMitigation(String mitigationId) {
        if (relatedMitigationIds == null) {
            relatedMitigationIds = new ArrayList<>();
        }
        if (!relatedMitigationIds.contains(mitigationId)) {
            relatedMitigationIds.add(mitigationId);
        }
    }
    
    public boolean isCritical() {
        return "CRITICAL".equals(severity);
    }
    
    public boolean isResolved() {
        return "RESOLVED".equals(status);
    }
}