package dev.doomsday.suitX.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "profiles")
public class ProfileEntity {

    @Id
    private String id;
    private String name;
    private String email;
    private String phone;
    private String birthDay; // can change to LocalDate if needed
    private String website;

    public ProfileEntity() {}

    public ProfileEntity(String id, String name, String email, String phone, String birthDay, String website) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.birthDay = birthDay;
        this.website = website;
    }

    // Getters and setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getBirthDay() { return birthDay; }
    public void setBirthDay(String birthDay) { this.birthDay = birthDay; }

    public String getWebsite() { return website; }
    public void setWebsite(String website) { this.website = website; }
}
