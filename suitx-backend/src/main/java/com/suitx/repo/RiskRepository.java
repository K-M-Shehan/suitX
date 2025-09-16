package com.suitx.repo;

import com.suitx.model.Risk;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface RiskRepository extends MongoRepository<Risk, String> {
    List<Risk> findByProjectId(String projectId);
}