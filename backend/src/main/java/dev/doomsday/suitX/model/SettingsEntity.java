package dev.doomsday.suitX.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "settings")
public class SettingsEntity {

    @Id
    private String id;
    private String email;
    private String username;
    private boolean emailAlerts;
    private boolean smsAlerts;
    private String message;

    public SettingsEntity() {}

    public SettingsEntity(String email, String username, boolean emailAlerts, boolean smsAlerts, String message) {
        this.email = email;
        this.username = username;
        this.emailAlerts = emailAlerts;
        this.smsAlerts = smsAlerts;
        this.message = message;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public boolean isEmailAlerts() {
        return emailAlerts;
    }

    public void setEmailAlerts(boolean emailAlerts) {
        this.emailAlerts = emailAlerts;
    }

    public boolean isSmsAlerts() {
        return smsAlerts;
    }

    public void setSmsAlerts(boolean smsAlerts) {
        this.smsAlerts = smsAlerts;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
