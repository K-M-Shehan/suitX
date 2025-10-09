package dev.doomsday.suitX.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import dev.doomsday.suitX.dto.ProjectDto;
import dev.doomsday.suitX.model.Project;
import dev.doomsday.suitX.repository.ProjectRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ProjectService {

    private final ProjectRepository projectRepository;

    public List<ProjectDto> getAllProjects() {
        return projectRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public List<ProjectDto> getAllProjectsByUser(String username) {
        if (username == null) {
            return getAllProjects();
        }
        return projectRepository.findByCreatedBy(username).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public List<ProjectDto> getActiveProjects() {
        return projectRepository.findByStatus("ACTIVE").stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public List<ProjectDto> getActiveProjectsByUser(String username) {
        if (username == null) {
            return getActiveProjects();
        }
        return projectRepository.findByCreatedByAndStatus(username, "ACTIVE").stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public Optional<ProjectDto> getProjectById(String id) {
        return projectRepository.findById(id)
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
        Optional<Project> existingProject = projectRepository.findById(id);
        if (existingProject.isPresent()) {
            Project project = existingProject.get();
            updateProjectFields(project, projectDto);
            project.setUpdatedAt(LocalDateTime.now());
            Project savedProject = projectRepository.save(project);
            return convertToDto(savedProject);
        }
        throw new RuntimeException("Project not found with id: " + id);
    }

    public void deleteProject(String id) {
        projectRepository.deleteById(id);
    }

    public boolean isProjectOwner(String projectId, String username) {
        return projectRepository.findById(projectId)
                .map(project -> project.getCreatedBy().equals(username))
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
    }
}