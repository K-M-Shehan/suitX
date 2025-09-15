package dev.doomsday.suitX.controller;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/profile")
public class ProfileController {

    private final ProfileService profileService;

    public ProfileController(ProfileService profileService) {
        this.profileService = profileService;
    }

    // Example endpoint
    @GetMapping("/")
    public String profileHome() {
        return "Profile API is running!";
    }
}
