package dev.doomsday.suitX.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import dev.doomsday.suitX.dto.ProjectDto;
import dev.doomsday.suitX.service.ProjectService;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/projects")
@RequiredArgsConstructor
public class ProjectController {

    private final ProjectService projectService;

    @GetMapping
    public ResponseEntity<List<ProjectDto>> getAllProjects(Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        String username = authentication.getName();
        List<ProjectDto> projects = projectService.getProjectsForUser(username);
        return ResponseEntity.ok(projects);
    }

    @GetMapping("/active")
    public ResponseEntity<List<ProjectDto>> getActiveProjects(Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        String username = authentication.getName();
        List<ProjectDto> activeProjects = projectService.getActiveProjectsByUser(username);
        return ResponseEntity.ok(activeProjects);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProjectDto> getProjectById(@PathVariable String id, Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        String username = authentication.getName();
        
        // Use the secure method that checks both owner and member access
        Optional<ProjectDto> project = projectService.getProjectById(id, username);
        
        return project.map(ResponseEntity::ok)
                .orElse(ResponseEntity.status(HttpStatus.FORBIDDEN).build());
    }

    @PostMapping
    public ResponseEntity<ProjectDto> createProject(@RequestBody ProjectDto projectDto, Authentication authentication) {
        try {
            if (authentication == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }
            String username = authentication.getName();
            projectDto.setCreatedBy(username);
            projectDto.setOwnerId(username); // Set ownerId as well
            ProjectDto createdProject = projectService.createProject(projectDto);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdProject);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProjectDto> updateProject(@PathVariable String id, @RequestBody ProjectDto projectDto, Authentication authentication) {
        try {
            if (authentication == null) {
                System.err.println("Update project failed: No authentication provided");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }
            String username = authentication.getName();
            System.out.println("User '" + username + "' attempting to update project: " + id);
            
            // Check ownership before updating (only owners can update)
            if (!projectService.isProjectOwner(id, username)) {
                System.err.println("Update project failed: User '" + username + "' is not owner of project: " + id);
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }
            
            System.out.println("Ownership verified, updating project: " + id);
            ProjectDto updatedProject = projectService.updateProject(id, projectDto);
            System.out.println("Project updated successfully: " + id);
            return ResponseEntity.ok(updatedProject);
        } catch (RuntimeException e) {
            System.err.println("Error updating project: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProject(@PathVariable String id, Authentication authentication) {
        try {
            if (authentication == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }
            String username = authentication.getName();
            
            // Check ownership before deleting (only owners can delete)
            if (!projectService.isProjectOwner(id, username)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }
            
            projectService.deleteProject(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
}