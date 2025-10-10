package dev.doomsday.suitX.service;

import dev.doomsday.suitX.model.SettingsEntity;
import dev.doomsday.suitX.repository.SettingsRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class SettingsService {

    private final SettingsRepository settingsRepository;

    public SettingsService(SettingsRepository settingsRepository) {
        this.settingsRepository = settingsRepository;
    }

    public Optional<SettingsEntity> getSettingsByEmail(String email) {
        return settingsRepository.findByEmail(email);
    }

    public SettingsEntity saveSettings(SettingsEntity settings) {
        return settingsRepository.save(settings);
    }
}
