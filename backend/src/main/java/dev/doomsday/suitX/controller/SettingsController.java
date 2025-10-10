package dev.doomsday.suitX.controller;

import dev.doomsday.suitX.model.User;
import dev.doomsday.suitX.model.UserSettings;
import dev.doomsday.suitX.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/settings")
public class SettingsController {
    
    private final UserService userService;
    
    public SettingsController(UserService userService) {
        this.userService = userService;
    }
    
    /**
     * Get current user's settings
     */
    @GetMapping
    public ResponseEntity<?> getSettings() {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth == null || auth.getPrincipal() == null) {
                return ResponseEntity.status(401).body(Map.of("error", "Not authenticated"));
            }
            
            String username = auth.getName();
            return userService.findByUsername(username)
                    .map(user -> ResponseEntity.ok((Object) user.getSettings()))
                    .orElse(ResponseEntity.status(404).body(Map.of("error", "User not found")));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Failed to fetch settings: " + e.getMessage()));
        }
    }
    
    /**
     * Update current user's settings
     */
    @PutMapping
    public ResponseEntity<?> updateSettings(@RequestBody UserSettings updatedSettings) {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth == null || auth.getPrincipal() == null) {
                return ResponseEntity.status(401).body(Map.of("error", "Not authenticated"));
            }
            
            String username = auth.getName();
            UserSettings updated = userService.updateUserSettings(username, updatedSettings);
            return ResponseEntity.ok(updated);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Failed to update settings: " + e.getMessage()));
        }
    }
    
    /**
     * Get notification settings
     */
    @GetMapping("/notifications")
    public ResponseEntity<?> getNotificationSettings() {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth == null) {
                return ResponseEntity.status(401).body(Map.of("error", "Not authenticated"));
            }
            
            String username = auth.getName();
            return userService.findByUsername(username)
                    .map(user -> ResponseEntity.ok((Object) user.getSettings().getNotifications()))
                    .orElse(ResponseEntity.status(404).body(Map.of("error", "User not found")));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Failed to fetch notification settings"));
        }
    }
    
    /**
     * Update notification settings
     */
    @PutMapping("/notifications")
    public ResponseEntity<?> updateNotificationSettings(@RequestBody UserSettings.NotificationSettings notifications) {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth == null) {
                return ResponseEntity.status(401).body(Map.of("error", "Not authenticated"));
            }
            
            String username = auth.getName();
            User user = userService.findByUsername(username)
                    .orElseThrow(() -> new IllegalArgumentException("User not found"));
            
            user.getSettings().setNotifications(notifications);
            userService.save(user);
            
            return ResponseEntity.ok(notifications);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Failed to update notification settings"));
        }
    }
    
    /**
     * Get privacy settings
     */
    @GetMapping("/privacy")
    public ResponseEntity<?> getPrivacySettings() {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth == null) {
                return ResponseEntity.status(401).body(Map.of("error", "Not authenticated"));
            }
            
            String username = auth.getName();
            return userService.findByUsername(username)
                    .map(user -> ResponseEntity.ok((Object) user.getSettings().getPrivacy()))
                    .orElse(ResponseEntity.status(404).body(Map.of("error", "User not found")));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Failed to fetch privacy settings"));
        }
    }
    
    /**
     * Update privacy settings
     */
    @PutMapping("/privacy")
    public ResponseEntity<?> updatePrivacySettings(@RequestBody UserSettings.PrivacySettings privacy) {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth == null) {
                return ResponseEntity.status(401).body(Map.of("error", "Not authenticated"));
            }
            
            String username = auth.getName();
            User user = userService.findByUsername(username)
                    .orElseThrow(() -> new IllegalArgumentException("User not found"));
            
            user.getSettings().setPrivacy(privacy);
            userService.save(user);
            
            return ResponseEntity.ok(privacy);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Failed to update privacy settings"));
        }
    }
    
    /**
     * Get theme settings
     */
    @GetMapping("/theme")
    public ResponseEntity<?> getThemeSettings() {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth == null) {
                return ResponseEntity.status(401).body(Map.of("error", "Not authenticated"));
            }
            
            String username = auth.getName();
            return userService.findByUsername(username)
                    .map(user -> ResponseEntity.ok((Object) user.getSettings().getTheme()))
                    .orElse(ResponseEntity.status(404).body(Map.of("error", "User not found")));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Failed to fetch theme settings"));
        }
    }
    
    /**
     * Update theme settings
     */
    @PutMapping("/theme")
    public ResponseEntity<?> updateThemeSettings(@RequestBody UserSettings.ThemeSettings theme) {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth == null) {
                return ResponseEntity.status(401).body(Map.of("error", "Not authenticated"));
            }
            
            String username = auth.getName();
            User user = userService.findByUsername(username)
                    .orElseThrow(() -> new IllegalArgumentException("User not found"));
            
            user.getSettings().setTheme(theme);
            userService.save(user);
            
            return ResponseEntity.ok(theme);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Failed to update theme settings"));
        }
    }
    
    /**
     * Get security settings
     */
    @GetMapping("/security")
    public ResponseEntity<?> getSecuritySettings() {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth == null) {
                return ResponseEntity.status(401).body(Map.of("error", "Not authenticated"));
            }
            
            String username = auth.getName();
            return userService.findByUsername(username)
                    .map(user -> ResponseEntity.ok((Object) user.getSettings().getSecurity()))
                    .orElse(ResponseEntity.status(404).body(Map.of("error", "User not found")));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Failed to fetch security settings"));
        }
    }
    
    /**
     * Update security settings
     */
    @PutMapping("/security")
    public ResponseEntity<?> updateSecuritySettings(@RequestBody UserSettings.SecuritySettings security) {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth == null) {
                return ResponseEntity.status(401).body(Map.of("error", "Not authenticated"));
            }
            
            String username = auth.getName();
            User user = userService.findByUsername(username)
                    .orElseThrow(() -> new IllegalArgumentException("User not found"));
            
            user.getSettings().setSecurity(security);
            userService.save(user);
            
            return ResponseEntity.ok(security);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Failed to update security settings"));
        }
    }
}
