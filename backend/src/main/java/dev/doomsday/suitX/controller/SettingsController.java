package dev.doomsday.suitX.controller;

import dev.doomsday.suitX.model.SettingsEntity;
import dev.doomsday.suitX.service.SettingsService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/settings")
@CrossOrigin(origins = "*")
public class SettingsController {

    private final SettingsService settingsService;

    public SettingsController(SettingsService settingsService) {
        this.settingsService = settingsService;
    }

    @GetMapping("/{email}")
    public ResponseEntity<?> getSettingsByEmail(@PathVariable String email) {
        Optional<SettingsEntity> settings = settingsService.getSettingsByEmail(email);
        return settings.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<SettingsEntity> saveSettings(@RequestBody SettingsEntity settings) {
        SettingsEntity saved = settingsService.saveSettings(settings);
        return ResponseEntity.ok(saved);
    }
}
