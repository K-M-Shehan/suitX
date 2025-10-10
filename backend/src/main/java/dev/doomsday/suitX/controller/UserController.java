package dev.doomsday.suitX.controller;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import dev.doomsday.suitX.model.User;
import dev.doomsday.suitX.service.UserService;

@RestController
@RequestMapping("/api/user")
public class UserController {
    
    private final UserService userService;
    
    public UserController(UserService userService) {
        this.userService = userService;
    }
    
    /**
     * Get current authenticated user's profile
     */
    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser() {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth == null || auth.getPrincipal() == null) {
                return ResponseEntity.status(401).body(Map.of("error", "Not authenticated"));
            }
            
            String username = auth.getName();
            return userService.findByUsername(username)
                    .map(user -> {
                        // Don't send password to frontend
                        user.setPassword(null);
                        return ResponseEntity.ok((Object) user);
                    })
                    .orElse(ResponseEntity.status(404).body(Map.of("error", "User not found")));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Failed to fetch user profile: " + e.getMessage()));
        }
    }
    
    /**
     * Update current authenticated user's profile
     */
    @PutMapping("/me")
    public ResponseEntity<?> updateCurrentUser(@RequestBody User updatedUser) {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth == null || auth.getPrincipal() == null) {
                return ResponseEntity.status(401).body(Map.of("error", "Not authenticated"));
            }
            
            String username = auth.getName();
            User updated = userService.updateUserProfile(username, updatedUser);
            
            // Don't send password to frontend
            updated.setPassword(null);
            return ResponseEntity.ok(updated);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Failed to update user profile: " + e.getMessage()));
        }
    }
    
    /**
     * Get user by ID (for viewing other users' profiles)
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> getUserById(@PathVariable String id) {
        try {
            return userService.findById(id)
                    .map(user -> {
                        // Don't send password to frontend
                        user.setPassword(null);
                        return ResponseEntity.ok((Object) user);
                    })
                    .orElse(ResponseEntity.status(404).body(Map.of("error", "User not found")));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Failed to fetch user: " + e.getMessage()));
        }
    }
}
