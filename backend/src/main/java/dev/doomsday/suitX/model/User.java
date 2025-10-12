package dev.doomsday.suitX.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * User entity representing application users
 * Supports both project owners and members with role-based permissions
 */
@Data
@Document(collection = "users")
public class User {
    @Id
    private String id;
    
    // Authentication fields
    @Indexed(unique = true)
    private String username;
    
    @Indexed(unique = true)
    private String email;
    
    private String password; // Hashed password
    
    // Profile fields
    private String firstName;
    private String lastName;
    private String role = "MEMBER"; // OWNER, MEMBER, ADMIN
    private String bio;
    private String avatar; // Base64 encoded image data or URL
    private String phone;
    private String department;
    
    // Project relationships
    // Projects where user is the owner/creator
    private List<String> ownedProjects = new ArrayList<>();
    
    // Projects where user is a member
    private List<String> memberProjects = new ArrayList<>();
    
    // User settings
    private UserSettings settings = new UserSettings();
    
    // Status tracking
    @Indexed
    private Boolean isActive = true;
    
    @CreatedDate
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    private LocalDateTime updatedAt;
    
    private LocalDateTime lastLogin;
    
    // Helper method to get full name
    public String getFullName() {
        if (firstName != null && lastName != null) {
            return firstName + " " + lastName;
        }
        return username;
    }
    
    // Helper method to check if user owns a project
    public boolean ownsProject(String projectId) {
        return ownedProjects != null && ownedProjects.contains(projectId);
    }
    
    // Helper method to check if user is member of a project
    public boolean isMemberOfProject(String projectId) {
        return memberProjects != null && memberProjects.contains(projectId);
    }
    
    // Helper method to check if user has access to a project
    public boolean hasAccessToProject(String projectId) {
        return ownsProject(projectId) || isMemberOfProject(projectId);
    }
}