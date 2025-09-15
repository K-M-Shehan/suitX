package dev.doomsday.suitX.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SettingsRepository extends MongoRepository<SettingsEntity, String> {
    // Repository skeleton
}
