package dev.doomsday.suitX.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import dev.doomsday.suitX.model.Project;

@Repository
public interface ProjectRepository extends MongoRepository<Project, String> {
    List<Project> findByStatus(String status);
    List<Project> findByCreatedBy(String createdBy);
    List<Project> findByCreatedByAndStatus(String createdBy, String status);
    List<Project> findByProjectManager(String projectManager);
    Long countByStatus(String status);
}