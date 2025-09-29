package dev.doomsday.suitX.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import dev.doomsday.suitX.dto.RiskDto;
import dev.doomsday.suitX.dto.RiskSummaryDto;
import dev.doomsday.suitX.model.Risk;
import dev.doomsday.suitX.repository.ProjectRepository;
import dev.doomsday.suitX.repository.RiskRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RiskService {

    private final RiskRepository riskRepository;
    private final ProjectRepository projectRepository;

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

    public RiskSummaryDto getRiskSummary() {
        RiskSummaryDto summary = new RiskSummaryDto();
        summary.setTotalRisks(riskRepository.count());
        summary.setTotalProjects(projectRepository.count());
        summary.setActiveRisks(riskRepository.countByStatus("ACTIVE"));
        summary.setResolvedRisks(riskRepository.countByStatus("RESOLVED"));
        summary.setHighSeverityRisks(riskRepository.countBySeverity("HIGH"));
        summary.setMediumSeverityRisks(riskRepository.countBySeverity("MEDIUM"));
        summary.setLowSeverityRisks(riskRepository.countBySeverity("LOW"));
        return summary;
    }

    private RiskDto convertToDto(Risk risk) {
        RiskDto dto = new RiskDto();
        dto.setId(risk.getId());
        dto.setTitle(risk.getTitle());
        dto.setDescription(risk.getDescription());
        dto.setType(risk.getType());
        dto.setSeverity(risk.getSeverity());
        dto.setStatus(risk.getStatus());
        dto.setProjectId(risk.getProjectId());
        dto.setAssignedTo(risk.getAssignedTo());
        dto.setCreatedAt(risk.getCreatedAt());
        dto.setUpdatedAt(risk.getUpdatedAt());
        dto.setResolvedAt(risk.getResolvedAt());
        dto.setCreatedBy(risk.getCreatedBy());
        return dto;
    }

    private Risk convertToEntity(RiskDto dto) {
        Risk risk = new Risk();
        risk.setId(dto.getId());
        risk.setTitle(dto.getTitle());
        risk.setDescription(dto.getDescription());
        risk.setType(dto.getType());
        risk.setSeverity(dto.getSeverity());
        risk.setStatus(dto.getStatus());
        risk.setProjectId(dto.getProjectId());
        risk.setAssignedTo(dto.getAssignedTo());
        risk.setCreatedAt(dto.getCreatedAt());
        risk.setUpdatedAt(dto.getUpdatedAt());
        risk.setResolvedAt(dto.getResolvedAt());
        risk.setCreatedBy(dto.getCreatedBy());
        return risk;
    }

    private void updateRiskFields(Risk risk, RiskDto dto) {
        if (dto.getTitle() != null) risk.setTitle(dto.getTitle());
        if (dto.getDescription() != null) risk.setDescription(dto.getDescription());
        if (dto.getType() != null) risk.setType(dto.getType());
        if (dto.getSeverity() != null) risk.setSeverity(dto.getSeverity());
        if (dto.getStatus() != null) risk.setStatus(dto.getStatus());
        if (dto.getProjectId() != null) risk.setProjectId(dto.getProjectId());
        if (dto.getAssignedTo() != null) risk.setAssignedTo(dto.getAssignedTo());
    }
}