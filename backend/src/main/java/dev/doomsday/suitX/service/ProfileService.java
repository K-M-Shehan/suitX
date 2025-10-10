package dev.doomsday.suitX.service;

import dev.doomsday.suitX.dto.ProfileDTO;
import dev.doomsday.suitX.model.ProfileEntity;
import dev.doomsday.suitX.repository.ProfileRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ProfileService {

    private final ProfileRepository profileRepository;

    public ProfileService(ProfileRepository profileRepository) {
        this.profileRepository = profileRepository;
    }

    private ProfileDTO convertToDTO(ProfileEntity entity) {
        return new ProfileDTO(
                entity.getUsername(),
                entity.getEmail(),
                entity.getPhone(),
                entity.getAddress(),
                entity.getGender(),
                entity.getBirthday(),
                entity.getBio(),
                entity.getImageUrl()
        );
    }

    private ProfileEntity convertToEntity(ProfileDTO dto) {
        ProfileEntity entity = new ProfileEntity();
        entity.setUsername(dto.getUsername());
        entity.setEmail(dto.getEmail());
        entity.setPhone(dto.getPhone());
        entity.setAddress(dto.getAddress());
        entity.setGender(dto.getGender());
        entity.setBirthday(dto.getBirthday());
        entity.setBio(dto.getBio());
        entity.setImageUrl(dto.getImageUrl());
        return entity;
    }

    public List<ProfileDTO> getAllProfiles() {
        return profileRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public Optional<ProfileDTO> getProfileById(String id) {
        return profileRepository.findById(id).map(this::convertToDTO);
    }

    public ProfileDTO createProfile(ProfileDTO dto) {
        return convertToDTO(profileRepository.save(convertToEntity(dto)));
    }

    public ProfileDTO updateProfile(String id, ProfileDTO dto) {
        return profileRepository.findById(id)
                .map(entity -> {
                    entity.setUsername(dto.getUsername());
                    entity.setEmail(dto.getEmail());
                    entity.setPhone(dto.getPhone());
                    entity.setAddress(dto.getAddress());
                    entity.setGender(dto.getGender());
                    entity.setBirthday(dto.getBirthday());
                    entity.setBio(dto.getBio());
                    entity.setImageUrl(dto.getImageUrl());
                    return convertToDTO(profileRepository.save(entity));
                })
                .orElse(null);
    }

    public void deleteProfile(String id) {
        profileRepository.deleteById(id);
    }
}
