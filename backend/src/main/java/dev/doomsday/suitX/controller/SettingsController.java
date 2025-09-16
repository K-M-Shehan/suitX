package dev.doomsday.suitX.controller;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/settings")
public class SettingsController {

    private final SettingsService settingsService;

    public SettingsController(SettingsService settingsService) {
        this.settingsService = settingsService;
    }

    // Example endpoint
    @GetMapping("/")
    public String settingsHome() {
        return "Settings API is running!";
    }
}
