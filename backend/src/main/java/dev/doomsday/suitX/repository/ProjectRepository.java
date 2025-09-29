package dev.doomsday.suitX.repository;

import dev.doomsday.suitX.model.Project;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProjectRepository extends MongoRepository<Project, String> {
    List<Project> findByCreatedBy(String createdBy);
    List<Project> findByCreatedByAndStatus(String createdBy, String status);
}