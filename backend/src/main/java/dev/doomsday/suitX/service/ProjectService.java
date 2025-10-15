package dev.doomsday.suitX.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import dev.doomsday.suitX.dto.ProjectDto;
import dev.doomsday.suitX.model.Project;
import dev.doomsday.suitX.model.Task;
import dev.doomsday.suitX.model.User;
import dev.doomsday.suitX.repository.ProjectRepository;
import dev.doomsday.suitX.repository.TaskRepository;
import dev.doomsday.suitX.repository.UserRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final TaskRepository taskRepository;
    private final UserService userService;
    private final UserRepository userRepository;

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
        
        // Get user ID for member lookup
        Optional<User> userOpt = userRepository.findByUsername(username);
        if (userOpt.isEmpty()) {
            return List.of();
        }
        String userId = userOpt.get().getId();
        
        // Use the optimized query that finds projects where user is owner OR member in one query
        return projectRepository.findAllAccessibleProjects(username, userId).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    public boolean canUserAccessProject(String projectId, String username) {
        if (username == null) {
            return false;
        }
        
        // Get user ID for owner and member lookup
        Optional<User> userOpt = userRepository.findByUsername(username);
        if (userOpt.isEmpty()) {
            return false;
        }
        String userId = userOpt.get().getId();
        
        return projectRepository.findById(projectId)
                .map(project -> project.isOwner(userId) || project.isMember(userId))
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
        
        // Get user ID for member lookup
        Optional<User> userOpt = userRepository.findByUsername(username);
        if (userOpt.isEmpty()) {
            return List.of();
        }
        String userId = userOpt.get().getId();
        
        return projectRepository.findActiveProjectsForUser(username, userId).stream()
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
        
        // Get user ID for access checks
        Optional<User> userOpt = userRepository.findByUsername(username);
        if (userOpt.isEmpty()) {
            return Optional.empty();
        }
        String userId = userOpt.get().getId();
        
        return projectRepository.findById(id)
                .filter(project -> {
                    // Check if user is owner (by userId)
                    if (project.isOwner(userId)) {
                        return true;
                    }
                    // Check if user is member (by userId)
                    if (project.isMember(userId)) {
                        return true;
                    }
                    // Backward compatibility: check createdBy field (username)
                    // This handles old projects where ownerId might contain username instead of userId
                    if (project.getCreatedBy() != null && project.getCreatedBy().equals(username)) {
                        return true;
                    }
                    // Backward compatibility: check if ownerId contains username (old bug)
                    if (project.getOwnerId() != null && project.getOwnerId().equals(username)) {
                        return true;
                    }
                    return false;
                })
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
        
        // Get user ID for ownership check
        Optional<User> userOpt = userRepository.findByUsername(username);
        if (userOpt.isEmpty()) {
            return false;
        }
        String userId = userOpt.get().getId();
        
        return projectRepository.findById(projectId)
                .map(project -> {
                    // Check ownerId (primary ownership field using user ID)
                    if (project.getOwnerId() != null && project.getOwnerId().equals(userId)) {
                        return true;
                    }
                    // Fallback: check createdBy (username) for legacy projects
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
    
    /**
     * Add a member to a project
     * Only project owner can add members
     */
    public ProjectDto addMemberToProject(String projectId, String memberUserId, String requestingUsername) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found with id: " + projectId));
        
        // Get requesting user's ID for ownership check
        Optional<User> requestingUserOpt = userRepository.findByUsername(requestingUsername);
        if (requestingUserOpt.isEmpty()) {
            throw new RuntimeException("Requesting user not found");
        }
        String requestingUserId = requestingUserOpt.get().getId();
        
        // Check if requesting user is the owner (by userId) or createdBy (by username)
        boolean isOwner = project.isOwner(requestingUserId) || 
                         (project.getCreatedBy() != null && project.getCreatedBy().equals(requestingUsername));
        
        if (!isOwner) {
            throw new RuntimeException("Only project owner can add members");
        }
        
        // Add member if not already added
        if (!project.isMember(memberUserId) && !project.isOwner(memberUserId)) {
            project.addMember(memberUserId);
            project.setUpdatedAt(LocalDateTime.now());
            Project savedProject = projectRepository.save(project);
            
            // Sync user's memberProjects list
            userService.addMemberProject(memberUserId, projectId);
            
            return convertToDto(savedProject);
        }
        
        // Already a member or owner
        return convertToDto(project);
    }
    
    /**
     * Remove a member from a project
     * Only project owner can remove members
     */
    public ProjectDto removeMemberFromProject(String projectId, String memberUserId, String requestingUsername) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found with id: " + projectId));
        
        // Get requesting user's ID for ownership check
        Optional<User> requestingUserOpt = userRepository.findByUsername(requestingUsername);
        if (requestingUserOpt.isEmpty()) {
            throw new RuntimeException("Requesting user not found");
        }
        String requestingUserId = requestingUserOpt.get().getId();
        
        // Check if requesting user is the owner (by userId) or createdBy (by username)
        boolean isOwner = project.isOwner(requestingUserId) || 
                         (project.getCreatedBy() != null && project.getCreatedBy().equals(requestingUsername));
        
        if (!isOwner) {
            throw new RuntimeException("Only project owner can remove members");
        }
        
        // Cannot remove the owner
        if (project.isOwner(memberUserId)) {
            throw new RuntimeException("Cannot remove project owner from members");
        }
        
        project.removeMember(memberUserId);
        project.setUpdatedAt(LocalDateTime.now());
        Project savedProject = projectRepository.save(project);
        
        // Sync user's memberProjects list
        userService.removeMemberProject(memberUserId, projectId);
        
        return convertToDto(savedProject);
    }
    
    /**
     * Get all members of a project (excluding owner)
     */
    public List<String> getProjectMembers(String projectId) {
        return projectRepository.findById(projectId)
                .map(Project::getMemberIds)
                .orElse(List.of());
    }
}