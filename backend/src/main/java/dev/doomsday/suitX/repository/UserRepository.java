package dev.doomsday.suitX.repository;

import dev.doomsday.suitX.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository interface for User entity
 * Provides custom query methods for user management
 */
@Repository
public interface UserRepository extends MongoRepository<User, String> {
    
    // Find user by username (for authentication)
    Optional<User> findByUsername(String username);
    
    // Find user by email (for authentication and password reset)
    Optional<User> findByEmail(String email);
    
    // Check if username exists
    boolean existsByUsername(String username);
    
    // Check if email exists
    boolean existsByEmail(String email);
    
    // Find all active users
    List<User> findByIsActive(Boolean isActive);
    
    // Find users by role
    List<User> findByRole(String role);
    
    // Find users by department
    List<User> findByDepartment(String department);
    
    // Find users who own a specific project
    List<User> findByOwnedProjectsContaining(String projectId);
    
    // Find users who are members of a specific project
    List<User> findByMemberProjectsContaining(String projectId);
    
    // Search users by name (case-insensitive)
    List<User> findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCase(
        String firstName, String lastName);
    
    // Search users by username or email (for adding members)
    List<User> findByUsernameContainingIgnoreCaseOrEmailContainingIgnoreCase(
        String username, String email);
}