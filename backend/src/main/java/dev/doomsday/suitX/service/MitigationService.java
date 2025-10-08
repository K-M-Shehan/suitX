package dev.doomsday.suitX.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import dev.doomsday.suitX.dto.MitigationDto;
import dev.doomsday.suitX.dto.MitigationSummaryDto;
import dev.doomsday.suitX.model.Mitigation;
import dev.doomsday.suitX.repository.MitigationRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MitigationService {

    private final MitigationRepository mitigationRepository;

    public List<MitigationDto> getAllMitigations() {
        return mitigationRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public List<MitigationDto> getMitigationsByStatus(String status) {
        return mitigationRepository.findByStatus(status).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public List<MitigationDto> getMitigationsByPriority(String priority) {
        return mitigationRepository.findByPriority(priority).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public List<MitigationDto> getMitigationsByAssignee(String assignee) {
        return mitigationRepository.findByAssignee(assignee).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public List<MitigationDto> getMitigationsByProject(String projectId) {
        return mitigationRepository.findByProjectId(projectId).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public Optional<MitigationDto> getMitigationById(String id) {
        return mitigationRepository.findById(id)
                .map(this::convertToDto);
    }

    public MitigationDto createMitigation(MitigationDto mitigationDto) {
        Mitigation mitigation = convertToEntity(mitigationDto);
        mitigation.setCreatedAt(LocalDateTime.now());
        mitigation.setUpdatedAt(LocalDateTime.now());
        mitigation.setStatus("PLANNED"); // Default status
        mitigation.setProgressPercentage(0.0); // Default progress
        Mitigation savedMitigation = mitigationRepository.save(mitigation);
        return convertToDto(savedMitigation);
    }

    public MitigationDto updateMitigation(String id, MitigationDto mitigationDto) {
        Optional<Mitigation> existingMitigation = mitigationRepository.findById(id);
        if (existingMitigation.isPresent()) {
            Mitigation mitigation = existingMitigation.get();
            updateMitigationFields(mitigation, mitigationDto);
            mitigation.setUpdatedAt(LocalDateTime.now());
            Mitigation savedMitigation = mitigationRepository.save(mitigation);
            return convertToDto(savedMitigation);
        }
        throw new RuntimeException("Mitigation not found with id: " + id);
    }

    public void deleteMitigation(String id) {
        mitigationRepository.deleteById(id);
    }

    public MitigationDto markAsCompleted(String id) {
        Optional<Mitigation> existingMitigation = mitigationRepository.findById(id);
        if (existingMitigation.isPresent()) {
            Mitigation mitigation = existingMitigation.get();
            mitigation.setStatus("COMPLETED");
            mitigation.setCompletedAt(LocalDateTime.now());
            mitigation.setUpdatedAt(LocalDateTime.now());
            mitigation.setProgressPercentage(100.0);
            Mitigation savedMitigation = mitigationRepository.save(mitigation);
            return convertToDto(savedMitigation);
        }
        throw new RuntimeException("Mitigation not found with id: " + id);
    }

    public MitigationDto updateProgress(String id, Double progress) {
        Optional<Mitigation> existingMitigation = mitigationRepository.findById(id);
        if (existingMitigation.isPresent()) {
            Mitigation mitigation = existingMitigation.get();
            mitigation.setProgressPercentage(progress);
            mitigation.setUpdatedAt(LocalDateTime.now());
            
            // Auto-complete if progress is 100%
            if (progress >= 100.0) {
                mitigation.setStatus("COMPLETED");
                mitigation.setCompletedAt(LocalDateTime.now());
            } else if ("PLANNED".equals(mitigation.getStatus()) && progress > 0) {
                mitigation.setStatus("ACTIVE");
            }
            
            Mitigation savedMitigation = mitigationRepository.save(mitigation);
            return convertToDto(savedMitigation);
        }
        throw new RuntimeException("Mitigation not found with id: " + id);
    }

    public MitigationSummaryDto getMitigationSummary() {
        MitigationSummaryDto summary = new MitigationSummaryDto();
        summary.setTotalMitigations(mitigationRepository.count());
        summary.setActiveMitigations(mitigationRepository.countByStatus("ACTIVE"));
        summary.setCompletedMitigations(mitigationRepository.countByStatus("COMPLETED"));
        summary.setPlannedMitigations(mitigationRepository.countByStatus("PLANNED"));
        summary.setHighPriorityMitigations(mitigationRepository.countByPriority("HIGH"));
        summary.setMediumPriorityMitigations(mitigationRepository.countByPriority("MEDIUM"));
        summary.setLowPriorityMitigations(mitigationRepository.countByPriority("LOW"));
        
        // Calculate overdue mitigations
        List<Mitigation> allMitigations = mitigationRepository.findAll();
        LocalDateTime today = LocalDateTime.now();
        long overdue = allMitigations.stream()
                .filter(m -> !"COMPLETED".equals(m.getStatus()))
                .filter(m -> m.getDueDate() != null && m.getDueDate().isBefore(today))
                .count();
        summary.setOverdueMitigations(overdue);
        
        return summary;
    }

    private MitigationDto convertToDto(Mitigation mitigation) {
        MitigationDto dto = new MitigationDto();
        dto.setId(mitigation.getId());
        dto.setTitle(mitigation.getTitle());
        dto.setDescription(mitigation.getDescription());
        dto.setStatus(mitigation.getStatus());
        dto.setPriority(mitigation.getPriority());
        dto.setAssignee(mitigation.getAssignee());
        dto.setDueDate(mitigation.getDueDate());
        dto.setRelatedRisk(mitigation.getRelatedRiskId());
        dto.setProjectId(mitigation.getProjectId());
        dto.setCreatedAt(mitigation.getCreatedAt());
        dto.setUpdatedAt(mitigation.getUpdatedAt());
        dto.setCompletedAt(mitigation.getCompletedAt());
        dto.setCreatedBy(mitigation.getCreatedBy());
        dto.setProgressPercentage(mitigation.getProgressPercentage());
        return dto;
    }

    private Mitigation convertToEntity(MitigationDto dto) {
        Mitigation mitigation = new Mitigation();
        mitigation.setId(dto.getId());
        mitigation.setTitle(dto.getTitle());
        mitigation.setDescription(dto.getDescription());
        mitigation.setStatus(dto.getStatus());
        mitigation.setPriority(dto.getPriority());
        mitigation.setAssignee(dto.getAssignee());
        mitigation.setDueDate(dto.getDueDate());
        mitigation.setRelatedRiskId(dto.getRelatedRisk());
        mitigation.setProjectId(dto.getProjectId());
        mitigation.setCreatedAt(dto.getCreatedAt());
        mitigation.setUpdatedAt(dto.getUpdatedAt());
        mitigation.setCompletedAt(dto.getCompletedAt());
        mitigation.setCreatedBy(dto.getCreatedBy());
        mitigation.setProgressPercentage(dto.getProgressPercentage());
        return mitigation;
    }

    private void updateMitigationFields(Mitigation mitigation, MitigationDto dto) {
        if (dto.getTitle() != null) mitigation.setTitle(dto.getTitle());
        if (dto.getDescription() != null) mitigation.setDescription(dto.getDescription());
        if (dto.getStatus() != null) mitigation.setStatus(dto.getStatus());
        if (dto.getPriority() != null) mitigation.setPriority(dto.getPriority());
        if (dto.getAssignee() != null) mitigation.setAssignee(dto.getAssignee());
        if (dto.getDueDate() != null) mitigation.setDueDate(dto.getDueDate());
        if (dto.getRelatedRisk() != null) mitigation.setRelatedRiskId(dto.getRelatedRisk());
        if (dto.getProjectId() != null) mitigation.setProjectId(dto.getProjectId());
        if (dto.getProgressPercentage() != null) mitigation.setProgressPercentage(dto.getProgressPercentage());
    }
}