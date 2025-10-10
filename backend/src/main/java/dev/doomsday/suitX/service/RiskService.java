package dev.doomsday.suitX.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import dev.doomsday.suitX.dto.AIAnalysisResponse;
import dev.doomsday.suitX.dto.AIRiskAssessment;
import dev.doomsday.suitX.dto.AIMitigationStrategy;
import dev.doomsday.suitX.dto.RiskDto;
import dev.doomsday.suitX.dto.RiskSummaryDto;
import dev.doomsday.suitX.model.Risk;
import dev.doomsday.suitX.model.Project;
import dev.doomsday.suitX.repository.ProjectRepository;
import dev.doomsday.suitX.repository.RiskRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RiskService {

    private final RiskRepository riskRepository;
    private final ProjectRepository projectRepository;
    private final GeminiAIService geminiAIService;

    public List<RiskDto> getAllRisks() {
        return riskRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public List<RiskDto> getRisksByStatus(String status) {
        return riskRepository.findByStatus(status).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public List<RiskDto> getRisksByProject(String projectId) {
        return riskRepository.findByProjectId(projectId).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public Optional<RiskDto> getRiskById(String id) {
        return riskRepository.findById(id)
                .map(this::convertToDto);
    }

    public RiskDto createRisk(RiskDto riskDto) {
        Risk risk = convertToEntity(riskDto);
        risk.setCreatedAt(LocalDateTime.now());
        risk.setUpdatedAt(LocalDateTime.now());
        risk.setStatus("ACTIVE"); // Default status
        Risk savedRisk = riskRepository.save(risk);
        return convertToDto(savedRisk);
    }

    public RiskDto updateRisk(String id, RiskDto riskDto) {
        Optional<Risk> existingRisk = riskRepository.findById(id);
        if (existingRisk.isPresent()) {
            Risk risk = existingRisk.get();
            updateRiskFields(risk, riskDto);
            risk.setUpdatedAt(LocalDateTime.now());
            Risk savedRisk = riskRepository.save(risk);
            return convertToDto(savedRisk);
        }
        throw new RuntimeException("Risk not found with id: " + id);
    }

    public void deleteRisk(String id) {
        riskRepository.deleteById(id);
    }

    public RiskDto resolveRisk(String id) {
        Optional<Risk> existingRisk = riskRepository.findById(id);
        if (existingRisk.isPresent()) {
            Risk risk = existingRisk.get();
            risk.setStatus("RESOLVED");
            risk.setResolvedAt(LocalDateTime.now());
            risk.setUpdatedAt(LocalDateTime.now());
            Risk savedRisk = riskRepository.save(risk);
            return convertToDto(savedRisk);
        }
        throw new RuntimeException("Risk not found with id: " + id);
    }

    public RiskDto ignoreRisk(String id) {
        Optional<Risk> existingRisk = riskRepository.findById(id);
        if (existingRisk.isPresent()) {
            Risk risk = existingRisk.get();
            risk.setStatus("IGNORED");
            risk.setUpdatedAt(LocalDateTime.now());
            Risk savedRisk = riskRepository.save(risk);
            return convertToDto(savedRisk);
        }
        throw new RuntimeException("Risk not found with id: " + id);
    }

    public RiskDto acceptRisk(String id) {
        Optional<Risk> existingRisk = riskRepository.findById(id);
        if (existingRisk.isPresent()) {
            Risk risk = existingRisk.get();
            risk.setStatus("ACCEPTED");
            risk.setUpdatedAt(LocalDateTime.now());
            Risk savedRisk = riskRepository.save(risk);
            return convertToDto(savedRisk);
        }
        throw new RuntimeException("Risk not found with id: " + id);
    }

    /**
     * Analyze a project and automatically generate risks
     */
    public List<RiskDto> analyzeAndGenerateRisks(String projectId, String userId) {
        // Get project
        Optional<Project> projectOpt = projectRepository.findById(projectId);
        if (projectOpt.isEmpty()) {
            throw new RuntimeException("Project not found with id: " + projectId);
        }
        
        Project project = projectOpt.get();
        
        // Use AI to analyze the project
        AIAnalysisResponse aiResponse = geminiAIService.analyzeExistingProject(project);
        
        // Save the AI-generated risks
        List<Risk> savedRisks = saveAIGeneratedRisks(
            projectId, 
            userId, 
            aiResponse.getIdentifiedRisks(), 
            aiResponse.getSuggestedMitigations()
        );
        
        // Convert to DTOs and return
        return savedRisks.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public RiskSummaryDto getRiskSummary(String username) {
        RiskSummaryDto summary = new RiskSummaryDto();
        
        // Get all projects for the user
        List<Project> userProjects = projectRepository.findByCreatedBy(username);
        List<String> userProjectIds = userProjects.stream()
                .map(Project::getId)
                .collect(Collectors.toList());
        
        // Get all risks for user's projects
        List<Risk> userRisks = riskRepository.findAll().stream()
                .filter(risk -> risk.getProjectId() != null && userProjectIds.contains(risk.getProjectId()))
                .collect(Collectors.toList());
        
        // Count totals
        summary.setTotalProjects((long) userProjects.size());
        summary.setTotalRisks((long) userRisks.size());
        
        // Count by status
        summary.setActiveRisks(userRisks.stream()
                .filter(risk -> "ACTIVE".equalsIgnoreCase(risk.getStatus()))
                .count());
        summary.setResolvedRisks(userRisks.stream()
                .filter(risk -> "RESOLVED".equalsIgnoreCase(risk.getStatus()))
                .count());
        
        // Count by severity
        summary.setHighSeverityRisks(userRisks.stream()
                .filter(risk -> "HIGH".equalsIgnoreCase(risk.getSeverity()))
                .count());
        summary.setMediumSeverityRisks(userRisks.stream()
                .filter(risk -> "MEDIUM".equalsIgnoreCase(risk.getSeverity()))
                .count());
        summary.setLowSeverityRisks(userRisks.stream()
                .filter(risk -> "LOW".equalsIgnoreCase(risk.getSeverity()))
                .count());
        
        return summary;
    }

    /**
     * Save AI-generated risks for a project
     */
    public List<Risk> saveAIGeneratedRisks(String projectId, String userId, List<AIRiskAssessment> aiRisks, List<AIMitigationStrategy> aiMitigations) {
        List<Risk> savedRisks = new ArrayList<>();
        
        // Get project to validate it exists
        Optional<Project> project = projectRepository.findById(projectId);
        if (project.isEmpty()) {
            throw new RuntimeException("Project not found with id: " + projectId);
        }
        
        for (AIRiskAssessment aiRisk : aiRisks) {
            Risk risk = new Risk();
            risk.setTitle(aiRisk.getTitle());
            risk.setDescription(aiRisk.getDescription());
            risk.setProjectId(projectId);
            risk.setCreatedBy(userId);
            
            // Map AI categories to Risk types
            risk.setType(mapCategory(aiRisk.getCategory()));
            risk.setSeverity(aiRisk.getPriority() != null ? aiRisk.getPriority() : "MEDIUM");
            risk.setLikelihood(mapProbabilityToLikelihood(aiRisk.getProbability()));
            
            // AI-specific fields
            risk.setAiGenerated(true);
            risk.setAiConfidence(aiRisk.getConfidenceScore() != null ? aiRisk.getConfidenceScore() * 100 : null);
            
            // Status and timeline
            risk.setStatus("IDENTIFIED");
            risk.setIdentifiedDate(LocalDateTime.now());
            
            // Calculate risk score
            risk.calculateRiskScore();
            
            // Add mitigation suggestions from AI
            if (aiMitigations != null) {
                for (AIMitigationStrategy aiMit : aiMitigations) {
                    if (aiMit.getRiskId() != null && aiMit.getRiskId().equals(aiRisk.getRiskId())) {
                        risk.addMitigationSuggestion(
                            aiMit.getDescription(),
                            true, // AI-generated
                            aiMit.getImplementationEffort()
                        );
                    }
                }
            }
            
            // Add history entry
            risk.addHistoryEntry(
                "RISK_CREATED",
                userId,
                null,
                "IDENTIFIED",
                "Risk identified by AI analysis"
            );
            
            Risk savedRisk = riskRepository.save(risk);
            
            // Update project with risk reference
            Project proj = project.get();
            proj.addRisk(savedRisk.getId());
            projectRepository.save(proj);
            
            savedRisks.add(savedRisk);
        }
        
        return savedRisks;
    }

    /**
     * Map AI category to Risk type
     */
    private String mapCategory(String category) {
        if (category == null) return "TECHNICAL";
        return switch (category.toUpperCase()) {
            case "TECHNICAL" -> "TECHNICAL";
            case "RESOURCE" -> "RESOURCE";
            case "TIMELINE" -> "SCHEDULE";
            case "SCHEDULE" -> "SCHEDULE";
            case "BUDGET" -> "FINANCIAL";
            case "FINANCIAL" -> "FINANCIAL";
            case "SCOPE" -> "SCOPE";
            case "QUALITY" -> "QUALITY";
            case "EXTERNAL" -> "SCOPE";
            default -> "TECHNICAL";
        };
    }

    /**
     * Map probability (0-100) to likelihood
     */
    private String mapProbabilityToLikelihood(Double probability) {
        if (probability == null) return "POSSIBLE";
        if (probability >= 80) return "CERTAIN";
        if (probability >= 60) return "LIKELY";
        if (probability >= 40) return "POSSIBLE";
        if (probability >= 20) return "UNLIKELY";
        return "RARE";
    }

    private RiskDto convertToDto(Risk risk) {
        RiskDto dto = new RiskDto();
        dto.setId(risk.getId());
        dto.setTitle(risk.getTitle());
        dto.setDescription(risk.getDescription());
        dto.setType(risk.getType());
        dto.setSeverity(risk.getSeverity());
        dto.setLikelihood(risk.getLikelihood());
        dto.setRiskScore(risk.getRiskScore());
        dto.setStatus(risk.getStatus());
        dto.setProjectId(risk.getProjectId());
        dto.setAssignedTo(risk.getAssignedTo());
        dto.setCreatedAt(risk.getCreatedAt());
        dto.setUpdatedAt(risk.getUpdatedAt());
        dto.setResolvedAt(risk.getResolvedAt());
        dto.setCreatedBy(risk.getCreatedBy());
        dto.setAiGenerated(risk.getAiGenerated());
        
        // Fetch project name if projectId exists
        if (risk.getProjectId() != null) {
            projectRepository.findById(risk.getProjectId())
                .ifPresent(project -> dto.setProjectName(project.getName()));
        }
        
        return dto;
    }

    private Risk convertToEntity(RiskDto dto) {
        Risk risk = new Risk();
        risk.setId(dto.getId());
        risk.setTitle(dto.getTitle());
        risk.setDescription(dto.getDescription());
        risk.setType(dto.getType());
        risk.setSeverity(dto.getSeverity());
        risk.setLikelihood(dto.getLikelihood());
        risk.setStatus(dto.getStatus());
        risk.setProjectId(dto.getProjectId());
        risk.setAssignedTo(dto.getAssignedTo());
        risk.setCreatedAt(dto.getCreatedAt());
        risk.setUpdatedAt(dto.getUpdatedAt());
        risk.setResolvedAt(dto.getResolvedAt());
        risk.setCreatedBy(dto.getCreatedBy());
        // Calculate risk score based on severity and likelihood
        risk.calculateRiskScore();
        return risk;
    }

    private void updateRiskFields(Risk risk, RiskDto dto) {
        if (dto.getTitle() != null) risk.setTitle(dto.getTitle());
        if (dto.getDescription() != null) risk.setDescription(dto.getDescription());
        if (dto.getType() != null) risk.setType(dto.getType());
        if (dto.getSeverity() != null) risk.setSeverity(dto.getSeverity());
        if (dto.getLikelihood() != null) risk.setLikelihood(dto.getLikelihood());
        if (dto.getStatus() != null) risk.setStatus(dto.getStatus());
        if (dto.getProjectId() != null) risk.setProjectId(dto.getProjectId());
        if (dto.getAssignedTo() != null) risk.setAssignedTo(dto.getAssignedTo());
        // Recalculate risk score when severity or likelihood changes
        risk.calculateRiskScore();
    }
}