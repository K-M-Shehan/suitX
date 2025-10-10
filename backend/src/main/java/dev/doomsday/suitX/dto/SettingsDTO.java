package dev.doomsday.suitX.dto;

public class SettingsDTO {
    private String username;
    private String email;
    private boolean emailAlerts;
    private boolean smsAlerts;
    private boolean profileVisible;
    private boolean searchVisible;
    private boolean darkMode;
    private boolean twoFactorAuth;
    private String contactMessage;

    public SettingsDTO() {}

    public SettingsDTO(String username, String email, boolean emailAlerts, boolean smsAlerts,
                       boolean profileVisible, boolean searchVisible, boolean darkMode,
                       boolean twoFactorAuth, String contactMessage) {
        this.username = username;
        this.email = email;
        this.emailAlerts = emailAlerts;
        this.smsAlerts = smsAlerts;
        this.profileVisible = profileVisible;
        this.searchVisible = searchVisible;
        this.darkMode = darkMode;
        this.twoFactorAuth = twoFactorAuth;
        this.contactMessage = contactMessage;
    }

    // Getters and setters
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public boolean isEmailAlerts() { return emailAlerts; }
    public void setEmailAlerts(boolean emailAlerts) { this.emailAlerts = emailAlerts; }

    public boolean isSmsAlerts() { return smsAlerts; }
    public void setSmsAlerts(boolean smsAlerts) { this.smsAlerts = smsAlerts; }

    public boolean isProfileVisible() { return profileVisible; }
    public void setProfileVisible(boolean profileVisible) { this.profileVisible = profileVisible; }

    public boolean isSearchVisible() { return searchVisible; }
    public void setSearchVisible(boolean searchVisible) { this.searchVisible = searchVisible; }

    public boolean isDarkMode() { return darkMode; }
    public void setDarkMode(boolean darkMode) { this.darkMode = darkMode; }

    public boolean isTwoFactorAuth() { return twoFactorAuth; }
    public void setTwoFactorAuth(boolean twoFactorAuth) { this.twoFactorAuth = twoFactorAuth; }

    public String getContactMessage() { return contactMessage; }
    public void setContactMessage(String contactMessage) { this.contactMessage = contactMessage; }
}
