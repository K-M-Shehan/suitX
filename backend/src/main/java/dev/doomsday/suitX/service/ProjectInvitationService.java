package dev.doomsday.suitX.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import dev.doomsday.suitX.model.Project;
import dev.doomsday.suitX.model.ProjectInvitation;
import dev.doomsday.suitX.model.User;
import dev.doomsday.suitX.repository.ProjectInvitationRepository;
import dev.doomsday.suitX.repository.ProjectRepository;
import dev.doomsday.suitX.repository.UserRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ProjectInvitationService {
    
    private final ProjectInvitationRepository invitationRepository;
    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;
    private final UserService userService;
    private final ProjectService projectService;
    private final EmailService emailService;
    
    /**
     * Send an invitation to a user to join a project
     */
    public ProjectInvitation inviteUserToProject(String projectId, String userId, String invitedByUsername, String message) {
        // Validate project exists
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found"));
        
        // Get the inviter's user ID from username
        User inviter = userRepository.findByUsername(invitedByUsername)
                .orElseThrow(() -> new RuntimeException("Inviter user not found"));
        String inviterUserId = inviter.getId();
        
        // Verify requesting user is owner
        if (!project.isOwner(inviterUserId)) {
            throw new RuntimeException("Only project owner can invite members");
        }
        
        // Validate user exists
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        // Check if user is already a member or owner
        if (project.isOwner(userId) || project.isMember(userId)) {
            throw new RuntimeException("User is already a member of this project");
        }
        
        // Check if there's already a pending invitation
        if (invitationRepository.existsByProjectIdAndUserIdAndStatus(projectId, userId, "PENDING")) {
            throw new RuntimeException("An invitation is already pending for this user");
        }
        
        // Create invitation
        ProjectInvitation invitation = new ProjectInvitation();
        invitation.setProjectId(projectId);
        invitation.setUserId(userId);
        invitation.setInvitedBy(invitedByUsername);
        invitation.setStatus("PENDING");
        invitation.setInvitedAt(LocalDateTime.now());
        invitation.setExpiresAt(LocalDateTime.now().plusDays(7)); // 7 days expiration
        invitation.setMessage(message);
        invitation.setProjectName(project.getName());
        invitation.setUserEmail(user.getEmail());
        invitation.setUserName(user.getUsername());
        
        ProjectInvitation savedInvitation = invitationRepository.save(invitation);
        
        // Send email notification
        sendInvitationEmail(invitation, project, user);
        
        return savedInvitation;
    }
    
    /**
     * Accept a project invitation
     */
    public void acceptInvitation(String invitationId, String username) {
        ProjectInvitation invitation = invitationRepository.findById(invitationId)
                .orElseThrow(() -> new RuntimeException("Invitation not found"));
        
        // Verify the user accepting is the invited user
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        if (!invitation.getUserId().equals(user.getId())) {
            throw new RuntimeException("You are not authorized to accept this invitation");
        }
        
        // Check if invitation is still pending
        if (!"PENDING".equals(invitation.getStatus())) {
            throw new RuntimeException("Invitation is no longer pending");
        }
        
        // Check if invitation has expired
        if (invitation.getExpiresAt().isBefore(LocalDateTime.now())) {
            invitation.setStatus("EXPIRED");
            invitationRepository.save(invitation);
            throw new RuntimeException("Invitation has expired");
        }
        
        // Add user to project
        projectService.addMemberToProject(invitation.getProjectId(), user.getId(), invitation.getInvitedBy());
        
        // Update invitation status
        invitation.setStatus("ACCEPTED");
        invitation.setRespondedAt(LocalDateTime.now());
        invitationRepository.save(invitation);
    }
    
    /**
     * Reject a project invitation
     */
    public void rejectInvitation(String invitationId, String username) {
        ProjectInvitation invitation = invitationRepository.findById(invitationId)
                .orElseThrow(() -> new RuntimeException("Invitation not found"));
        
        // Verify the user rejecting is the invited user
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        if (!invitation.getUserId().equals(user.getId())) {
            throw new RuntimeException("You are not authorized to reject this invitation");
        }
        
        // Update invitation status
        invitation.setStatus("REJECTED");
        invitation.setRespondedAt(LocalDateTime.now());
        invitationRepository.save(invitation);
    }
    
    /**
     * Get all invitations for a user
     */
    public List<ProjectInvitation> getUserInvitations(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        return invitationRepository.findByUserId(user.getId());
    }
    
    /**
     * Get pending invitations for a user
     */
    public List<ProjectInvitation> getPendingInvitations(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        List<ProjectInvitation> invitations = invitationRepository.findByUserIdAndStatus(user.getId(), "PENDING");
        
        // Filter out expired invitations and update their status
        return invitations.stream()
                .filter(inv -> {
                    if (inv.getExpiresAt().isBefore(LocalDateTime.now())) {
                        inv.setStatus("EXPIRED");
                        invitationRepository.save(inv);
                        return false;
                    }
                    return true;
                })
                .collect(Collectors.toList());
    }
    
    /**
     * Cancel an invitation (by project owner)
     */
    public void cancelInvitation(String invitationId, String username) {
        ProjectInvitation invitation = invitationRepository.findById(invitationId)
                .orElseThrow(() -> new RuntimeException("Invitation not found"));
        
        // Verify requesting user is the one who sent the invitation or project owner
        Project project = projectRepository.findById(invitation.getProjectId())
                .orElseThrow(() -> new RuntimeException("Project not found"));
        
        // Get user ID from username
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        if (!project.isOwner(user.getId())) {
            throw new RuntimeException("Only project owner can cancel invitations");
        }
        
        invitation.setStatus("CANCELLED");
        invitationRepository.save(invitation);
    }
    
    /**
     * Send invitation email
     */
    private void sendInvitationEmail(ProjectInvitation invitation, Project project, User user) {
        emailService.sendProjectInvitationEmail(
            user.getEmail(),
            user.getUsername(),
            project.getName(),
            invitation.getInvitedBy(),
            invitation.getMessage(),
            invitation.getExpiresAt().toLocalDate().toString()
        );
    }
}
