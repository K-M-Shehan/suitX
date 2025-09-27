package dev.doomsday.suitX.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import dev.doomsday.suitX.model.ProfileEntity;
import dev.doomsday.suitX.service.ProfileService;

@RestController
@RequestMapping("/api/profile")
public class ProfileController {

    private final ProfileService profileService;

    public ProfileController(ProfileService profileService) {
        this.profileService = profileService;
    }

    // Get all profiles
    @GetMapping("/")
    public List<ProfileEntity> getAllProfiles() {
        return profileService.getAllProfiles();
    }

    // Get profile by ID
    @GetMapping("/{id}")
    public ResponseEntity<ProfileEntity> getProfileById(@PathVariable String id) {
        return profileService.getProfileById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Create a new profile
    @PostMapping("/")
    public ProfileEntity createProfile(@RequestBody ProfileEntity profile) {
        return profileService.createProfile(profile);
    }

    // Update an existing profile
    @PutMapping("/{id}")
    public ProfileEntity updateProfile(@PathVariable String id, @RequestBody ProfileEntity profile) {
        return profileService.updateProfile(id, profile);
    }

    // Delete a profile
    @DeleteMapping("/{id}")
    public void deleteProfile(@PathVariable String id) {
        profileService.deleteProfile(id);
    }
}
