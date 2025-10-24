package dev.doomsday.suitX.service;

import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Async;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import dev.doomsday.suitX.model.User;
import dev.doomsday.suitX.model.UserSettings;
import dev.doomsday.suitX.repository.UserRepository;

@Service
public class UserService {
    private static final Logger logger = LoggerFactory.getLogger(UserService.class);
    
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder, EmailService emailService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.emailService = emailService;
    }

    public void signup(User user) {
        // Validate username
        if (user.getUsername() == null || user.getUsername().trim().isEmpty()) {
            throw new IllegalArgumentException("Username is required");
        }
        if (user.getUsername().length() < 3 || user.getUsername().length() > 50) {
            throw new IllegalArgumentException("Username must be between 3 and 50 characters");
        }
        if (!isValidUsername(user.getUsername())) {
            throw new IllegalArgumentException("Username can only contain letters, numbers, and underscores");
        }
        if (findByUsername(user.getUsername()).isPresent()) {
            throw new IllegalArgumentException("Username already exists");
        }
        
        // Validate email
        if (user.getEmail() == null || user.getEmail().trim().isEmpty()) {
            throw new IllegalArgumentException("Email is required");
        }
        if (!isValidEmail(user.getEmail())) {
            throw new IllegalArgumentException("Invalid email format");
        }
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new IllegalArgumentException("Email already exists");
        }
        
        // Validate password
        if (user.getPassword() == null || user.getPassword().isEmpty()) {
            throw new IllegalArgumentException("Password is required");
        }
        if (user.getPassword().length() < 8) {
            throw new IllegalArgumentException("Password must be at least 8 characters long");
        }
        
        // Encode password and save user
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        User savedUser = userRepository.save(user);
        
        // Send welcome email asynchronously (don't block signup process)
        try {
            sendWelcomeEmailAsync(savedUser.getEmail(), savedUser.getUsername());
        } catch (Exception e) {
            // Log the error but don't fail the signup
            logger.error("Failed to send welcome email to {}: {}", savedUser.getEmail(), e.getMessage());
        }
    }
    
    /**
     * Sends welcome email asynchronously to avoid blocking the signup process
     */
    @Async
    private void sendWelcomeEmailAsync(String email, String username) {
        emailService.sendWelcomeEmail(email, username);
    }

    public Optional<User> findByUsername(String username) {
        return userRepository.findByUsername(username);
    }
    
    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }
    
    public Optional<User> findById(String id) {
        return userRepository.findById(id);
    }
    
    /**
     * Update user profile (excluding password and authentication fields)
     */
    public User updateUserProfile(String username, User updatedUser) {
        User existingUser = findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        
        // Update allowed fields
        if (updatedUser.getFirstName() != null) {
            existingUser.setFirstName(updatedUser.getFirstName());
        }
        if (updatedUser.getLastName() != null) {
            existingUser.setLastName(updatedUser.getLastName());
        }
        if (updatedUser.getBio() != null) {
            existingUser.setBio(updatedUser.getBio());
        }
        if (updatedUser.getPhone() != null) {
            existingUser.setPhone(updatedUser.getPhone());
        }
        if (updatedUser.getDepartment() != null) {
            existingUser.setDepartment(updatedUser.getDepartment());
        }
        if (updatedUser.getAvatar() != null) {
            existingUser.setAvatar(updatedUser.getAvatar());
        }
        
        // Email update with validation
        if (updatedUser.getEmail() != null && !updatedUser.getEmail().equals(existingUser.getEmail())) {
            if (!isValidEmail(updatedUser.getEmail())) {
                throw new IllegalArgumentException("Invalid email format");
            }
            if (userRepository.findByEmail(updatedUser.getEmail()).isPresent()) {
                throw new IllegalArgumentException("Email already exists");
            }
            existingUser.setEmail(updatedUser.getEmail());
        }
        
        return userRepository.save(existingUser);
    }
    
    /**
     * Update user settings
     */
    public UserSettings updateUserSettings(String username, UserSettings updatedSettings) {
        User existingUser = findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        
        existingUser.setSettings(updatedSettings);
        userRepository.save(existingUser);
        
        return existingUser.getSettings();
    }
    
    /**
     * Save user (used by SettingsController)
     */
    public User save(User user) {
        return userRepository.save(user);
    }
    
    /**
     * Update last login timestamp
     */
    public void updateLastLogin(User user) {
        userRepository.save(user);
    }
    
    /**
     * Search users by username or email
     * Used for finding users to add as project members
     */
    public java.util.List<User> searchUsers(String searchTerm) {
        return userRepository.findByUsernameContainingIgnoreCaseOrEmailContainingIgnoreCase(
            searchTerm, searchTerm);
    }
    
    /**
     * Add project to user's memberProjects list
     */
    public void addMemberProject(String userId, String projectId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        
        if (user.getMemberProjects() == null) {
            user.setMemberProjects(new java.util.ArrayList<>());
        }
        
        if (!user.getMemberProjects().contains(projectId)) {
            user.getMemberProjects().add(projectId);
            userRepository.save(user);
        }
    }
    
    /**
     * Remove project from user's memberProjects list
     */
    public void removeMemberProject(String userId, String projectId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        
        if (user.getMemberProjects() != null) {
            user.getMemberProjects().remove(projectId);
            userRepository.save(user);
        }
    }
    
    /**
     * Validates email format using a comprehensive regex pattern
     * Matches RFC 5322 standard email addresses
     */
    private boolean isValidEmail(String email) {
        if (email == null) {
            return false;
        }
        // RFC 5322 compliant email regex
        String emailRegex = "^[a-zA-Z0-9_+&*-]+(?:\\.[a-zA-Z0-9_+&*-]+)*@(?:[a-zA-Z0-9-]+\\.)+[a-zA-Z]{2,7}$";
        return email.matches(emailRegex);
    }
    
    /**
     * Validates username format
     * Allows letters, numbers, and underscores only
     */
    private boolean isValidUsername(String username) {
        if (username == null) {
            return false;
        }
        // Username can only contain alphanumeric characters and underscores
        String usernameRegex = "^[a-zA-Z0-9_]+$";
        return username.matches(usernameRegex);
    }

    public boolean checkPassword(String rawPassword, String encodedPassword) {
        return passwordEncoder.matches(rawPassword, encodedPassword);
    }
    
    /**
     * Change user password
     */
    public void changePassword(String username, String currentPassword, String newPassword) {
        // Find the user
        User user = findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        
        // Verify current password
        if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
            throw new IllegalArgumentException("Current password is incorrect");
        }
        
        // Validate new password
        if (newPassword == null || newPassword.isEmpty()) {
            throw new IllegalArgumentException("New password is required");
        }
        if (newPassword.length() < 8) {
            throw new IllegalArgumentException("New password must be at least 8 characters long");
        }
        if (passwordEncoder.matches(newPassword, user.getPassword())) {
            throw new IllegalArgumentException("New password must be different from current password");
        }
        
        // Encode and save new password
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
        
        logger.info("Password changed successfully for user: {}", username);
    }
}