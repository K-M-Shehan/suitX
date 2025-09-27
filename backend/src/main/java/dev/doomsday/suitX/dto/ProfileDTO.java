package dev.doomsday.suitX.dto;

public class ProfileDTO {

    private String name;
    private String email;
    private String phone;
    private String birthDay;
    private String website;

    public ProfileDTO() {}

    public ProfileDTO(String name, String email, String phone, String birthDay, String website) {
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.birthDay = birthDay;
        this.website = website;
    }

    // Getters and setters
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
