package dev.doomsday.suitX.repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import dev.doomsday.suitX.model.ProjectInvitation;

@Repository
public interface ProjectInvitationRepository extends MongoRepository<ProjectInvitation, String> {
    
    // Find invitation by project and user
    Optional<ProjectInvitation> findByProjectIdAndUserId(String projectId, String userId);
    
    // Find all invitations for a user
    List<ProjectInvitation> findByUserId(String userId);
    
    // Find pending invitations for a user
    List<ProjectInvitation> findByUserIdAndStatus(String userId, String status);
    
    // Find all invitations for a project
    List<ProjectInvitation> findByProjectId(String projectId);
    
    // Find expired invitations
    List<ProjectInvitation> findByStatusAndExpiresAtBefore(String status, LocalDateTime dateTime);
    
    // Check if invitation exists
    boolean existsByProjectIdAndUserIdAndStatus(String projectId, String userId, String status);
}
