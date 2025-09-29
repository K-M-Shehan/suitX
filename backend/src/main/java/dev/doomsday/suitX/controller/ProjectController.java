package dev.doomsday.suitX.controller;

import dev.doomsday.suitX.model.Project;
import dev.doomsday.suitX.service.ProjectService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/projects")
@CrossOrigin(origins = "http://localhost:5173")
public class ProjectController {

    private final ProjectService projectService;

    public ProjectController(ProjectService projectService) {
        this.projectService = projectService;
    }

    @GetMapping
    public ResponseEntity<List<Project>> getAllProjects(Authentication authentication) {
        String username = authentication.getName();
        List<Project> projects = projectService.getAllProjectsByUser(username);
        return ResponseEntity.ok(projects);
    }

    @PostMapping
    public ResponseEntity<Project> createProject(@RequestBody Project project, Authentication authentication) {
        String username = authentication.getName();
        Project createdProject = projectService.createProject(project, username);
        return ResponseEntity.ok(createdProject);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Project> getProject(@PathVariable String id, Authentication authentication) {
        String username = authentication.getName();
        return projectService.getProjectById(id)
                .filter(project -> project.getCreatedBy().equals(username))
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Project> updateProject(@PathVariable String id, @RequestBody Project project, 
                                               Authentication authentication) {
        String username = authentication.getName();
        
        if (!projectService.isProjectOwner(id, username)) {
            return ResponseEntity.status(403).build();
        }
        
        project.setId(id);
        Project updatedProject = projectService.updateProject(project);
        return ResponseEntity.ok(updatedProject);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProject(@PathVariable String id, Authentication authentication) {
        String username = authentication.getName();
        
        if (!projectService.isProjectOwner(id, username)) {
            return ResponseEntity.status(403).build();
        }
        
        projectService.deleteProject(id);
        return ResponseEntity.ok().build();
    }
}