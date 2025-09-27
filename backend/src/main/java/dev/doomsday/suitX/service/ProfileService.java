package dev.doomsday.suitX.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import dev.doomsday.suitX.model.ProfileEntity;
import dev.doomsday.suitX.repository.ProfileRepository;

@Service
public class ProfileService {

    private final ProfileRepository profileRepository;

    public ProfileService(ProfileRepository profileRepository) {
        this.profileRepository = profileRepository;
    }

    public List<ProfileEntity> getAllProfiles() {
        return profileRepository.findAll();
    }

    public Optional<ProfileEntity> getProfileById(String id) {
        return profileRepository.findById(id);
    }

    public ProfileEntity createProfile(ProfileEntity profile) {
        return profileRepository.save(profile);
    }

    public ProfileEntity updateProfile(String id, ProfileEntity profile) {
        profile.setId(id);
        return profileRepository.save(profile);
    }

    public void deleteProfile(String id) {
        profileRepository.deleteById(id);
    }
}
