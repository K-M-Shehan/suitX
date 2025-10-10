package dev.doomsday.suitX.repository;

import dev.doomsday.suitX.model.SettingsEntity;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SettingsRepository extends MongoRepository<SettingsEntity, String> {
    Optional<SettingsEntity> findByEmail(String email);
}
