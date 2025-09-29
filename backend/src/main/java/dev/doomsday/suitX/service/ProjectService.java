package dev.doomsday.suitX.service;

import dev.doomsday.suitX.model.Project;
import dev.doomsday.suitX.repository.ProjectRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class ProjectService {
    
    private final ProjectRepository projectRepository;

    public ProjectService(ProjectRepository projectRepository) {
        this.projectRepository = projectRepository;
    }

    public List<Project> getAllProjectsByUser(String username) {
        return projectRepository.findByCreatedBy(username);
    }

    public List<Project> getActiveProjectsByUser(String username) {
        return projectRepository.findByCreatedByAndStatus(username, "ACTIVE");
    }

    public Optional<Project> getProjectById(String id) {
        return projectRepository.findById(id);
    }

    public Project createProject(Project project, String username) {
        project.setCreatedBy(username);
        project.setCreatedAt(LocalDateTime.now());
        project.setUpdatedAt(LocalDateTime.now());
        return projectRepository.save(project);
    }

    public Project updateProject(Project project) {
        project.setUpdatedAt(LocalDateTime.now());
        return projectRepository.save(project);
    }

    public void deleteProject(String id) {
        projectRepository.deleteById(id);
    }

    public boolean isProjectOwner(String projectId, String username) {
        return projectRepository.findById(projectId)
                .map(project -> project.getCreatedBy().equals(username))
                .orElse(false);
    }
}