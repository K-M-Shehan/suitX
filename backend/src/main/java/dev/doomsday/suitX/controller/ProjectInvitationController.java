package dev.doomsday.suitX.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import dev.doomsday.suitX.model.ProjectInvitation;
import dev.doomsday.suitX.service.ProjectInvitationService;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/invitations")
@RequiredArgsConstructor
public class ProjectInvitationController {
    
    private final ProjectInvitationService invitationService;
    
    /**
     * Send invitation to user to join project
     */
    @PostMapping
    public ResponseEntity<?> inviteUser(@RequestBody Map<String, String> request, Authentication authentication) {
        try {
            if (authentication == null || authentication.getPrincipal() == null) {
                return ResponseEntity.status(401).body(Map.of("error", "Not authenticated"));
            }
            
            String projectId = request.get("projectId");
            String userId = request.get("userId");
            String message = request.get("message");
            String username = authentication.getName();
            
            ProjectInvitation invitation = invitationService.inviteUserToProject(projectId, userId, username, message);
            return ResponseEntity.ok(invitation);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Failed to send invitation: " + e.getMessage()));
        }
    }
    
    /**
     * Get all invitations for current user
     */
    @GetMapping("/my-invitations")
    public ResponseEntity<?> getMyInvitations(Authentication authentication) {
        try {
            if (authentication == null || authentication.getPrincipal() == null) {
                return ResponseEntity.status(401).body(Map.of("error", "Not authenticated"));
            }
            
            String username = authentication.getName();
            List<ProjectInvitation> invitations = invitationService.getUserInvitations(username);
            return ResponseEntity.ok(invitations);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Failed to fetch invitations: " + e.getMessage()));
        }
    }
    
    /**
     * Get pending invitations for current user
     */
    @GetMapping("/pending")
    public ResponseEntity<?> getPendingInvitations(Authentication authentication) {
        try {
            if (authentication == null || authentication.getPrincipal() == null) {
                return ResponseEntity.status(401).body(Map.of("error", "Not authenticated"));
            }
            
            String username = authentication.getName();
            List<ProjectInvitation> invitations = invitationService.getPendingInvitations(username);
            return ResponseEntity.ok(invitations);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Failed to fetch pending invitations: " + e.getMessage()));
        }
    }
    
    /**
     * Accept an invitation
     */
    @PostMapping("/{id}/accept")
    public ResponseEntity<?> acceptInvitation(@PathVariable String id, Authentication authentication) {
        try {
            if (authentication == null || authentication.getPrincipal() == null) {
                return ResponseEntity.status(401).body(Map.of("error", "Not authenticated"));
            }
            
            String username = authentication.getName();
            invitationService.acceptInvitation(id, username);
            return ResponseEntity.ok(Map.of("message", "Invitation accepted successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Failed to accept invitation: " + e.getMessage()));
        }
    }
    
    /**
     * Reject an invitation
     */
    @PostMapping("/{id}/reject")
    public ResponseEntity<?> rejectInvitation(@PathVariable String id, Authentication authentication) {
        try {
            if (authentication == null || authentication.getPrincipal() == null) {
                return ResponseEntity.status(401).body(Map.of("error", "Not authenticated"));
            }
            
            String username = authentication.getName();
            invitationService.rejectInvitation(id, username);
            return ResponseEntity.ok(Map.of("message", "Invitation rejected"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Failed to reject invitation: " + e.getMessage()));
        }
    }
    
    /**
     * Cancel an invitation (by project owner)
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> cancelInvitation(@PathVariable String id, Authentication authentication) {
        try {
            if (authentication == null || authentication.getPrincipal() == null) {
                return ResponseEntity.status(401).body(Map.of("error", "Not authenticated"));
            }
            
            String username = authentication.getName();
            invitationService.cancelInvitation(id, username);
            return ResponseEntity.ok(Map.of("message", "Invitation cancelled"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Failed to cancel invitation: " + e.getMessage()));
        }
    }
}
