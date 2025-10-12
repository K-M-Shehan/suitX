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
import dev.doomsday.suitX.model.Project;
import dev.doomsday.suitX.model.User;
import dev.doomsday.suitX.repository.MitigationRepository;
import dev.doomsday.suitX.repository.ProjectRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MitigationService {

    private final MitigationRepository mitigationRepository;
    private final ProjectRepository projectRepository;
    private final dev.doomsday.suitX.repository.UserRepository userRepository;
    private final dev.doomsday.suitX.repository.RiskRepository riskRepository;
    private final ProjectService projectService;
    private final NotificationService notificationService;
    private final EmailService emailService;

    public List<MitigationDto> getAllMitigations() {
        return mitigationRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    /**
     * Get mitigations only for projects the current user has access to
     * @param username Username of the current user
     * @return List of mitigations from user's accessible projects
     */
    public List<MitigationDto> getMitigationsForUser(String username) {
        // Get all projects the user has access to
        List<String> accessibleProjectIds = projectService.getProjectsForUser(username).stream()
                .map(project -> project.getId())
                .collect(Collectors.toList());
        
        // Get mitigations only for accessible projects
        return mitigationRepository.findAll().stream()
                .filter(mitigation -> accessibleProjectIds.contains(mitigation.getProjectId()))
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
        
        // Send notification and email if mitigation is assigned
        if (savedMitigation.getAssignee() != null) {
            sendMitigationAssignmentNotification(savedMitigation);
        }
        
        return convertToDto(savedMitigation);
    }

    public MitigationDto updateMitigation(String id, MitigationDto mitigationDto) {
        Optional<Mitigation> existingMitigation = mitigationRepository.findById(id);
        if (existingMitigation.isPresent()) {
            Mitigation mitigation = existingMitigation.get();
            String previousAssignee = mitigation.getAssignee(); // Store previous assignee
            
            updateMitigationFields(mitigation, mitigationDto);
            mitigation.setUpdatedAt(LocalDateTime.now());
            Mitigation savedMitigation = mitigationRepository.save(mitigation);
            
            // Send notification if assignee changed
            if (savedMitigation.getAssignee() != null && 
                !savedMitigation.getAssignee().equals(previousAssignee)) {
                sendMitigationAssignmentNotification(savedMitigation);
            }
            
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
        dto.setStartDate(mitigation.getStartDate());
        dto.setRelatedRiskId(mitigation.getRelatedRiskId());
        dto.setProjectId(mitigation.getProjectId());
        dto.setCreatedAt(mitigation.getCreatedAt());
        dto.setUpdatedAt(mitigation.getUpdatedAt());
        dto.setCompletedAt(mitigation.getCompletedAt());
        dto.setCreatedBy(mitigation.getCreatedBy());
        dto.setProgressPercentage(mitigation.getProgressPercentage());
        dto.setEstimatedCost(mitigation.getEstimatedCost());
        dto.setActualCost(mitigation.getActualCost());
        dto.setAiGenerated(mitigation.getAiGenerated());
        dto.setEffectiveness(mitigation.getEffectiveness());
        
        // Populate username fields if available
        if (mitigation.getAssignee() != null) {
            userRepository.findById(mitigation.getAssignee())
                .ifPresent(user -> dto.setAssigneeUsername(user.getUsername()));
        }
        
        if (mitigation.getCreatedBy() != null) {
            userRepository.findById(mitigation.getCreatedBy())
                .ifPresent(user -> dto.setCreatedByUsername(user.getUsername()));
        }
        
        // Populate project name if available
        if (mitigation.getProjectId() != null) {
            projectRepository.findById(mitigation.getProjectId())
                .ifPresent(project -> dto.setProjectName(project.getName()));
        }
        
        // Populate related risk title if available
        if (mitigation.getRelatedRiskId() != null) {
            riskRepository.findById(mitigation.getRelatedRiskId())
                .ifPresent(risk -> dto.setRelatedRisk(risk.getTitle()));
        }
        
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

    /**
     * Send notification and email when a mitigation is assigned to a user
     */
    private void sendMitigationAssignmentNotification(Mitigation mitigation) {
        try {
            // Get assigned user
            Optional<User> userOpt = userRepository.findById(mitigation.getAssignee());
            if (userOpt.isEmpty()) {
                System.err.println("User not found for mitigation assignment: " + mitigation.getAssignee());
                return;
            }
            User user = userOpt.get();
            
            // Get project details
            Optional<Project> projectOpt = mitigation.getProjectId() != null 
                ? projectRepository.findById(mitigation.getProjectId()) 
                : Optional.empty();
            Project project = projectOpt.orElse(null);
            
            // Create notification using NotificationService
            String message = String.format(
                "You have been assigned to mitigation '%s'%s",
                mitigation.getTitle(),
                project != null ? " in project '" + project.getName() + "'" : ""
            );
            
            notificationService.createNotification(
                user.getId(),
                "MITIGATION_ASSIGNED",
                "New Mitigation Assigned",
                message,
                mitigation.getId(),
                "MITIGATION"
            );
            
            // Send email with professional HTML template
            // Format the due date properly (same as task assignment)
            String formattedDueDate = null;
            if (mitigation.getDueDate() != null) {
                formattedDueDate = mitigation.getDueDate().toString();
            }
            
            // Prepare email parameters with null safety
            String emailAddress = user.getEmail();
            String username = user.getUsername() != null ? user.getUsername() : user.getEmail();
            String title = mitigation.getTitle() != null ? mitigation.getTitle() : "Untitled Mitigation";
            String projectName = project != null ? project.getName() : "Independent Mitigation";
            String priority = mitigation.getPriority() != null ? mitigation.getPriority() : "MEDIUM";
            String dueDate = formattedDueDate;
            String description = mitigation.getDescription() != null ? mitigation.getDescription() : "";
            
            System.out.println("DEBUG - Sending mitigation email with parameters:");
            System.out.println("  Email: " + emailAddress);
            System.out.println("  Username: " + username);
            System.out.println("  Title: " + title);
            System.out.println("  Project: " + projectName);
            System.out.println("  Priority: " + priority);
            System.out.println("  DueDate: " + dueDate);
            System.out.println("  Description: " + (description.length() > 50 ? description.substring(0, 50) + "..." : description));
            
            emailService.sendMitigationAssignmentEmail(
                emailAddress,
                username,
                title,
                projectName,
                priority,
                dueDate,
                description
            );
        } catch (Exception e) {
            // Log error but don't fail the mitigation update
            System.err.println("Failed to send mitigation assignment notification: " + e.getMessage());
            e.printStackTrace(); // Print full stack trace for debugging
        }
    }
}