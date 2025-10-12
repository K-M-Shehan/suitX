package dev.doomsday.suitX.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import dev.doomsday.suitX.dto.TaskDto;
import dev.doomsday.suitX.model.Task;
import dev.doomsday.suitX.repository.TaskRepository;
import dev.doomsday.suitX.repository.ProjectRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TaskService {

    private final TaskRepository taskRepository;
    private final ProjectRepository projectRepository;
    private final ProjectService projectService;

    public List<TaskDto> getAllTasks() {
        return taskRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public List<TaskDto> getTasksByProject(String projectId) {
        return taskRepository.findByProjectId(projectId).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public List<TaskDto> getTasksByAssignee(String userId) {
        return taskRepository.findByAssignedTo(userId).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public Optional<TaskDto> getTaskById(String id) {
        return taskRepository.findById(id)
                .map(this::convertToDto);
    }

    @Transactional
    public TaskDto createTask(TaskDto taskDto) {
        Task task = convertToEntity(taskDto);
        task.setCreatedAt(LocalDateTime.now());
        task.setUpdatedAt(LocalDateTime.now());
        
        // Set default values if not provided
        if (task.getStatus() == null) {
            task.setStatus("TODO");
        }
        if (task.getPriority() == null) {
            task.setPriority("MEDIUM");
        }
        
        // Validate assignedTo user has access to project if assigned
        if (task.getAssignedTo() != null && task.getProjectId() != null) {
            validateTaskAssignment(task.getProjectId(), task.getAssignedTo());
        }
        
        Task savedTask = taskRepository.save(task);
        
        // Add task ID to project's taskIds list
        if (taskDto.getProjectId() != null) {
            projectRepository.findById(taskDto.getProjectId()).ifPresent(project -> {
                project.addTask(savedTask.getId());
                projectRepository.save(project);
            });
            
            // Update project progress after creating task
            projectService.updateProjectProgress(taskDto.getProjectId());
        }
        
        return convertToDto(savedTask);
    }

    @Transactional
    public List<TaskDto> createMultipleTasks(List<TaskDto> taskDtos, String projectId) {
        return taskDtos.stream()
                .map(taskDto -> {
                    taskDto.setProjectId(projectId);
                    return createTask(taskDto);
                })
                .collect(Collectors.toList());
    }

    @Transactional
    public TaskDto updateTask(String id, TaskDto taskDto) {
        Optional<Task> existingTask = taskRepository.findById(id);
        if (existingTask.isPresent()) {
            Task task = existingTask.get();
            String projectId = task.getProjectId(); // Store project ID before update
            
            // Validate assignedTo user has access to project if being assigned/changed
            if (taskDto.getAssignedTo() != null && projectId != null && 
                !taskDto.getAssignedTo().equals(task.getAssignedTo())) {
                validateTaskAssignment(projectId, taskDto.getAssignedTo());
            }
            
            updateTaskFields(task, taskDto);
            task.setUpdatedAt(LocalDateTime.now());
            
            // If status changed to DONE, set completed date
            if ("DONE".equals(taskDto.getStatus()) && task.getCompletedAt() == null) {
                task.setCompletedAt(LocalDateTime.now());
            }
            // If status changed from DONE to something else, clear completed date
            else if (!"DONE".equals(taskDto.getStatus()) && task.getCompletedAt() != null) {
                task.setCompletedAt(null);
            }
            
            Task savedTask = taskRepository.save(task);
            
            // Update project progress after task status changes
            if (projectId != null) {
                projectService.updateProjectProgress(projectId);
            }
            
            return convertToDto(savedTask);
        }
        throw new RuntimeException("Task not found with id: " + id);
    }

    @Transactional
    public void deleteTask(String id) {
        // Store project ID before deletion for progress update
        String projectId = taskRepository.findById(id)
                .map(Task::getProjectId)
                .orElse(null);
        
        // Remove task ID from project's taskIds list
        taskRepository.findById(id).ifPresent(task -> {
            if (task.getProjectId() != null) {
                projectRepository.findById(task.getProjectId()).ifPresent(project -> {
                    if (project.getTaskIds() != null) {
                        project.getTaskIds().remove(id);
                        projectRepository.save(project);
                    }
                });
            }
        });
        
        taskRepository.deleteById(id);
        
        // Update project progress after deleting task
        if (projectId != null) {
            projectService.updateProjectProgress(projectId);
        }
    }

    public boolean isTaskCreator(String taskId, String username) {
        if (username == null) {
            return false;
        }
        return taskRepository.findById(taskId)
                .map(task -> username.equals(task.getCreatedBy()))
                .orElse(false);
    }

    public boolean canAccessTask(String taskId, String username) {
        if (username == null) {
            return false;
        }
        // Check if user has access to the task's project (as owner or member)
        return taskRepository.findById(taskId)
                .map(task -> projectService.canUserAccessProject(task.getProjectId(), username))
                .orElse(false);
    }

    private TaskDto convertToDto(Task task) {
        TaskDto dto = new TaskDto();
        dto.setId(task.getId());
        dto.setTitle(task.getTitle());
        dto.setDescription(task.getDescription());
        dto.setProjectId(task.getProjectId());
        dto.setStatus(task.getStatus());
        dto.setPriority(task.getPriority());
        dto.setAssignedTo(task.getAssignedTo());
        dto.setCreatedBy(task.getCreatedBy());
        dto.setDueDate(task.getDueDate());
        dto.setStartDate(task.getStartDate());
        dto.setCompletedAt(task.getCompletedAt());
        dto.setEstimatedHours(task.getEstimatedHours());
        dto.setActualHours(task.getActualHours());
        dto.setDependencies(task.getDependencies());
        dto.setTags(task.getTags());
        dto.setCreatedAt(task.getCreatedAt());
        dto.setUpdatedAt(task.getUpdatedAt());
        return dto;
    }

    private Task convertToEntity(TaskDto dto) {
        Task task = new Task();
        task.setId(dto.getId());
        task.setTitle(dto.getTitle());
        task.setDescription(dto.getDescription());
        task.setProjectId(dto.getProjectId());
        task.setStatus(dto.getStatus());
        task.setPriority(dto.getPriority());
        task.setAssignedTo(dto.getAssignedTo());
        task.setCreatedBy(dto.getCreatedBy());
        task.setDueDate(dto.getDueDate());
        task.setStartDate(dto.getStartDate());
        task.setCompletedAt(dto.getCompletedAt());
        task.setEstimatedHours(dto.getEstimatedHours());
        task.setActualHours(dto.getActualHours());
        task.setDependencies(dto.getDependencies());
        task.setTags(dto.getTags());
        task.setCreatedAt(dto.getCreatedAt());
        task.setUpdatedAt(dto.getUpdatedAt());
        return task;
    }

    private void updateTaskFields(Task task, TaskDto dto) {
        if (dto.getTitle() != null) task.setTitle(dto.getTitle());
        if (dto.getDescription() != null) task.setDescription(dto.getDescription());
        if (dto.getStatus() != null) task.setStatus(dto.getStatus());
        if (dto.getPriority() != null) task.setPriority(dto.getPriority());
        if (dto.getAssignedTo() != null) task.setAssignedTo(dto.getAssignedTo());
        if (dto.getDueDate() != null) task.setDueDate(dto.getDueDate());
        if (dto.getStartDate() != null) task.setStartDate(dto.getStartDate());
        if (dto.getEstimatedHours() != null) task.setEstimatedHours(dto.getEstimatedHours());
        if (dto.getActualHours() != null) task.setActualHours(dto.getActualHours());
        if (dto.getDependencies() != null) task.setDependencies(dto.getDependencies());
        if (dto.getTags() != null) task.setTags(dto.getTags());
    }
    
    /**
     * Validate that assigned user has access to the project
     * Only project owner and members can be assigned tasks
     */
    private void validateTaskAssignment(String projectId, String userId) {
        if (!projectService.canUserAccessProject(projectId, userId)) {
            throw new IllegalArgumentException(
                "User must be project owner or member to be assigned tasks");
        }
    }
}
