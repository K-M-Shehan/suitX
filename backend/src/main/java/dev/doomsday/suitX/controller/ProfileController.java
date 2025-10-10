package dev.doomsday.suitX.controller;

import dev.doomsday.suitX.dto.ProfileDTO;
import dev.doomsday.suitX.service.ProfileService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/profile")
@CrossOrigin(origins = "http://localhost:5173")
public class ProfileController {

    private final ProfileService profileService;

    public ProfileController(ProfileService profileService) {
        this.profileService = profileService;
    }

    @GetMapping("/")
    public List<ProfileDTO> getAllProfiles() {
        return profileService.getAllProfiles();
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProfileDTO> getProfileById(@PathVariable String id) {
        return profileService.getProfileById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.status(404).body(null));
    }

    @PostMapping("/")
    public ProfileDTO createProfile(@RequestBody ProfileDTO dto) {
        return profileService.createProfile(dto);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProfileDTO> updateProfile(@PathVariable String id, @RequestBody ProfileDTO dto) {
        ProfileDTO updated = profileService.updateProfile(id, dto);
        return updated != null ? ResponseEntity.ok(updated) : ResponseEntity.status(404).body(null);
    }

    @DeleteMapping("/{id}")
    public void deleteProfile(@PathVariable String id) {
        profileService.deleteProfile(id);
    }
}
