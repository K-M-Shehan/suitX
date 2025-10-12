package dev.doomsday.suitX.model;

import java.time.LocalDateTime;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Project Invitation Model
 * Represents an invitation to join a project
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "project_invitations")
@CompoundIndex(name = "project_user_idx", def = "{'projectId': 1, 'userId': 1}", unique = true)
public class ProjectInvitation {
    
    @Id
    private String id;
    
    @Indexed
    private String projectId;
    
    @Indexed
    private String userId;         // User being invited
    
    private String invitedBy;      // Username of person who sent invitation
    
    private String status;         // PENDING, ACCEPTED, REJECTED, EXPIRED
    
    private LocalDateTime invitedAt;
    
    private LocalDateTime respondedAt;
    
    private LocalDateTime expiresAt;  // Invitation expires after 7 days
    
    private String message;        // Optional message from inviter
    
    // Project details (denormalized for email)
    private String projectName;
    
    // User details (denormalized for easy lookup)
    private String userEmail;
    private String userName;
}
