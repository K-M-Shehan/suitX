package dev.doomsday.suitX.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import dev.doomsday.suitX.dto.ProjectDto;
import dev.doomsday.suitX.model.Project;
import dev.doomsday.suitX.model.Task;
import dev.doomsday.suitX.repository.ProjectRepository;
import dev.doomsday.suitX.repository.TaskRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final TaskRepository taskRepository;

    public List<ProjectDto> getAllProjects() {
        return projectRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public List<ProjectDto> getAllProjectsByUser(String username) {
        if (username == null) {
            return List.of(); // Return empty list instead of all projects
        }
        // Find projects where user is creator OR member
        return projectRepository.findByCreatedBy(username).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    public List<ProjectDto> getProjectsForUser(String username) {
        if (username == null) {
            return List.of();
        }
        // Use the optimized query that finds projects where user is owner OR member in one query
        return projectRepository.findAllAccessibleProjects(username).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    public boolean canUserAccessProject(String projectId, String username) {
        if (username == null) {
            return false;
        }
        return projectRepository.findById(projectId)
                .map(project -> project.isOwner(username) || project.isMember(username))
                .orElse(false);
    }

    public List<ProjectDto> getActiveProjects() {
        return projectRepository.findByStatus("ACTIVE").stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public List<ProjectDto> getActiveProjectsByUser(String username) {
        if (username == null) {
            return List.of(); // Return empty list instead of all active projects
        }
        return projectRepository.findByCreatedByAndStatus(username, "ACTIVE").stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public Optional<ProjectDto> getProjectById(String id) {
        return projectRepository.findById(id)
                .map(this::convertToDto);
    }
    
    public Optional<ProjectDto> getProjectById(String id, String username) {
        if (username == null) {
            return Optional.empty();
        }
        return projectRepository.findById(id)
                .filter(project -> project.isOwner(username) || project.isMember(username))
                .map(this::convertToDto);
    }

    public ProjectDto createProject(ProjectDto projectDto) {
        Project project = convertToEntity(projectDto);
        project.setCreatedAt(LocalDateTime.now());
        project.setUpdatedAt(LocalDateTime.now());
        if (project.getStatus() == null) {
            project.setStatus("ACTIVE"); // Default status
        }
        if (project.getProgressPercentage() == null) {
            project.setProgressPercentage(0.0); // Default progress
        }
        Project savedProject = projectRepository.save(project);
        return convertToDto(savedProject);
    }

    public ProjectDto updateProject(String id, ProjectDto projectDto) {
        System.out.println("ProjectService.updateProject called with id: " + id);
        Optional<Project> existingProject = projectRepository.findById(id);
        if (existingProject.isPresent()) {
            System.out.println("Project found, updating fields...");
            Project project = existingProject.get();
            try {
                updateProjectFields(project, projectDto);
                project.setUpdatedAt(LocalDateTime.now());
                System.out.println("Saving updated project...");
                Project savedProject = projectRepository.save(project);
                System.out.println("Project saved successfully");
                return convertToDto(savedProject);
            } catch (Exception e) {
                System.err.println("Error during project update: " + e.getMessage());
                e.printStackTrace();
                throw new RuntimeException("Failed to update project: " + e.getMessage(), e);
            }
        }
        System.err.println("Project not found with id: " + id);
        throw new RuntimeException("Project not found with id: " + id);
    }

    public void deleteProject(String id) {
        projectRepository.deleteById(id);
    }

    public boolean isProjectOwner(String projectId, String username) {
        if (username == null) {
            return false;
        }
        return projectRepository.findById(projectId)
                .map(project -> {
                    // Check ownerId first (primary ownership field), then createdBy as fallback
                    if (project.getOwnerId() != null && project.getOwnerId().equals(username)) {
                        return true;
                    }
                    return project.getCreatedBy() != null && project.getCreatedBy().equals(username);
                })
                .orElse(false);
    }

    private ProjectDto convertToDto(Project project) {
        ProjectDto dto = new ProjectDto();
        dto.setId(project.getId());
        dto.setName(project.getName());
        dto.setDescription(project.getDescription());
        dto.setStatus(project.getStatus());
        dto.setProgressPercentage(project.getProgressPercentage());
        dto.setStartDate(project.getStartDate());
        dto.setEndDate(project.getEndDate());
        dto.setCreatedAt(project.getCreatedAt());
        dto.setUpdatedAt(project.getUpdatedAt());
        dto.setCreatedBy(project.getCreatedBy());
        dto.setOwnerId(project.getOwnerId());
        dto.setProjectManager(project.getProjectManager());
        dto.setMemberIds(project.getMemberIds());
        dto.setTaskIds(project.getTaskIds());
        dto.setRiskIds(project.getRiskIds());
        dto.setBudget(project.getBudget());
        dto.setTags(project.getTags());
        return dto;
    }

    private Project convertToEntity(ProjectDto dto) {
        Project project = new Project();
        project.setId(dto.getId());
        project.setName(dto.getName());
        project.setDescription(dto.getDescription());
        project.setStatus(dto.getStatus());
        project.setProgressPercentage(dto.getProgressPercentage());
        project.setStartDate(dto.getStartDate());
        project.setEndDate(dto.getEndDate());
        project.setCreatedAt(dto.getCreatedAt());
        project.setUpdatedAt(dto.getUpdatedAt());
        project.setCreatedBy(dto.getCreatedBy());
        project.setOwnerId(dto.getOwnerId());
        project.setProjectManager(dto.getProjectManager());
        project.setMemberIds(dto.getMemberIds());
        project.setTaskIds(dto.getTaskIds());
        project.setRiskIds(dto.getRiskIds());
        project.setBudget(dto.getBudget());
        project.setTags(dto.getTags());
        return project;
    }

    private void updateProjectFields(Project project, ProjectDto dto) {
        if (dto.getName() != null) project.setName(dto.getName());
        if (dto.getDescription() != null) project.setDescription(dto.getDescription());
        if (dto.getStatus() != null) project.setStatus(dto.getStatus());
        if (dto.getProgressPercentage() != null) project.setProgressPercentage(dto.getProgressPercentage());
        if (dto.getStartDate() != null) project.setStartDate(dto.getStartDate());
        if (dto.getEndDate() != null) project.setEndDate(dto.getEndDate());
        if (dto.getProjectManager() != null) project.setProjectManager(dto.getProjectManager());
        if (dto.getBudget() != null) project.setBudget(dto.getBudget());
        if (dto.getTags() != null) project.setTags(dto.getTags());
        if (dto.getTaskIds() != null) project.setTaskIds(dto.getTaskIds());
        if (dto.getRiskIds() != null) project.setRiskIds(dto.getRiskIds());
        if (dto.getMemberIds() != null) project.setMemberIds(dto.getMemberIds());
    }
    
    /**
     * Calculate and update project progress based on completed tasks
     * Progress = (Number of DONE tasks / Total tasks) * 100
     */
    public void updateProjectProgress(String projectId) {
        Optional<Project> projectOpt = projectRepository.findById(projectId);
        if (projectOpt.isEmpty()) {
            System.err.println("Cannot update progress: Project not found with id: " + projectId);
            return;
        }
        
        Project project = projectOpt.get();
        List<Task> tasks = taskRepository.findByProjectId(projectId);
        
        if (tasks.isEmpty()) {
            // No tasks = 0% progress
            project.setProgressPercentage(0.0);
            System.out.println("Project " + projectId + " has no tasks, progress set to 0%");
        } else {
            long completedTasks = tasks.stream()
                    .filter(task -> "DONE".equals(task.getStatus()))
                    .count();
            
            double progress = (double) completedTasks / tasks.size() * 100.0;
            project.setProgressPercentage(Math.round(progress * 100.0) / 100.0); // Round to 2 decimal places
            
            System.out.println("Project " + projectId + " progress updated: " + 
                    completedTasks + "/" + tasks.size() + " tasks completed = " + 
                    project.getProgressPercentage() + "%");
        }
        
        project.setUpdatedAt(LocalDateTime.now());
        projectRepository.save(project);
    }
}