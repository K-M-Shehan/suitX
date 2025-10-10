package dev.doomsday.suitX.dto;

public class ProfileDTO {
    private String username;
    private String email;
    private String phone;
    private String address;
    private String gender;
    private String birthday;
    private String bio;
    private String imageUrl;

    public ProfileDTO() {}

    public ProfileDTO(String username, String email, String phone,
                      String address, String gender, String birthday,
                      String bio, String imageUrl) {
        this.username = username;
        this.email = email;
        this.phone = phone;
        this.address = address;
        this.gender = gender;
        this.birthday = birthday;
        this.bio = bio;
        this.imageUrl = imageUrl;
    }

    // Getters & setters
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }

    public String getBirthday() { return birthday; }
    public void setBirthday(String birthday) { this.birthday = birthday; }

    public String getBio() { return bio; }
    public void setBio(String bio) { this.bio = bio; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
}
