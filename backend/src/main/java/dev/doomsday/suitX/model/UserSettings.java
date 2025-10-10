package dev.doomsday.suitX.model;

import lombok.Data;

/**
 * User settings embedded in User document
 * Contains all user preferences and configuration
 */
@Data
public class UserSettings {
    
    // Notification preferences
    private NotificationSettings notifications = new NotificationSettings();
    
    // Privacy preferences
    private PrivacySettings privacy = new PrivacySettings();
    
    // Theme preferences
    private ThemeSettings theme = new ThemeSettings();
    
    // Security preferences
    private SecuritySettings security = new SecuritySettings();
    
    @Data
    public static class NotificationSettings {
        private boolean emailAlerts = true;
        private boolean smsAlerts = false;
        private boolean pushNotifications = true;
        private boolean projectUpdates = true;
        private boolean riskAlerts = true;
        private boolean taskAssignments = true;
        private boolean weeklyDigest = false;
    }
    
    @Data
    public static class PrivacySettings {
        private boolean profileVisible = true;
        private boolean searchVisible = true;
        private boolean showEmail = false;
        private boolean showPhone = false;
        private boolean allowProjectInvites = true;
    }
    
    @Data
    public static class ThemeSettings {
        private boolean darkMode = false;
        private String colorScheme = "blue"; // blue, green, purple, etc.
        private String fontSize = "medium"; // small, medium, large
        private boolean compactView = false;
    }
    
    @Data
    public static class SecuritySettings {
        private boolean twoFactorEnabled = false;
        private boolean sessionTimeout = true;
        private int sessionTimeoutMinutes = 30;
        private boolean requirePasswordChange = false;
        private int passwordChangeIntervalDays = 90;
    }
}
