package dev.doomsday.suitX.controller;

import java.util.List;

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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import dev.doomsday.suitX.dto.TaskDto;
import dev.doomsday.suitX.service.TaskService;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/tasks")
@RequiredArgsConstructor
public class TaskController {

    private final TaskService taskService;

    @GetMapping
    public ResponseEntity<List<TaskDto>> getAllTasks() {
        List<TaskDto> tasks = taskService.getAllTasks();
        return ResponseEntity.ok(tasks);
    }

    @GetMapping("/project/{projectId}")
    public ResponseEntity<List<TaskDto>> getTasksByProject(@PathVariable String projectId) {
        List<TaskDto> tasks = taskService.getTasksByProject(projectId);
        return ResponseEntity.ok(tasks);
    }

    @GetMapping("/assignee/{userId}")
    public ResponseEntity<List<TaskDto>> getTasksByAssignee(@PathVariable String userId) {
        List<TaskDto> tasks = taskService.getTasksByAssignee(userId);
        return ResponseEntity.ok(tasks);
    }

    @GetMapping("/{id}")
    public ResponseEntity<TaskDto> getTaskById(@PathVariable String id, Authentication authentication) {
        String username = authentication != null ? authentication.getName() : null;
        
        return taskService.getTaskById(id)
                .map(task -> {
                    // Check if user has access to this task
                    if (username != null && !taskService.canAccessTask(id, username)) {
                        return ResponseEntity.status(HttpStatus.FORBIDDEN).<TaskDto>build();
                    }
                    return ResponseEntity.ok(task);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<TaskDto> createTask(@RequestBody TaskDto taskDto, Authentication authentication) {
        try {
            String username = authentication != null ? authentication.getName() : "anonymous";
            taskDto.setCreatedBy(username);
            TaskDto createdTask = taskService.createTask(taskDto);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdTask);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    @PostMapping("/bulk")
    public ResponseEntity<List<TaskDto>> createMultipleTasks(
            @RequestBody List<TaskDto> taskDtos,
            @RequestParam String projectId,
            Authentication authentication) {
        try {
            String username = authentication != null ? authentication.getName() : "anonymous";
            taskDtos.forEach(dto -> dto.setCreatedBy(username));
            List<TaskDto> createdTasks = taskService.createMultipleTasks(taskDtos, projectId);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdTasks);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<TaskDto> updateTask(
            @PathVariable String id,
            @RequestBody TaskDto taskDto,
            Authentication authentication) {
        try {
            if (authentication == null) {
                System.err.println("Update task failed: No authentication provided");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }
            
            String username = authentication.getName();
            System.out.println("User '" + username + "' attempting to update task: " + id);
            
            // Check access before updating
            if (!taskService.canAccessTask(id, username)) {
                System.err.println("Update task failed: User '" + username + "' cannot access task: " + id);
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }
            
            System.out.println("Access verified, updating task: " + id);
            TaskDto updatedTask = taskService.updateTask(id, taskDto);
            System.out.println("Task updated successfully: " + id);
            return ResponseEntity.ok(updatedTask);
        } catch (RuntimeException e) {
            System.err.println("Error updating task: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTask(@PathVariable String id, Authentication authentication) {
        try {
            String username = authentication != null ? authentication.getName() : null;
            
            // Check access before deleting
            if (username != null && !taskService.canAccessTask(id, username)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }
            
            taskService.deleteTask(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
}
