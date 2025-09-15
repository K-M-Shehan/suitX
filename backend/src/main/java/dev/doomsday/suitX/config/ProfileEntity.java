package dev.doomsday.suitX.config;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "profiles")
public class ProfileEntity {

    @Id
    private String id;

    private Name name;
    private Email email;
    private Phone phone;
    private BirthDay birthDay;
    private Website website;

    // Sub-classes as inner classes
    public static class Name { }
    public static class Email { }
    public static class Phone { }
    public static class BirthDay { }
    public static class Website { }

    // Getters and setters can be added later
}
