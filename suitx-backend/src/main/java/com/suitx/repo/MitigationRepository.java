package com.suitx.repo;

import com.suitx.model.Mitigation;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface MitigationRepository extends MongoRepository<Mitigation, String> {
    List<Mitigation> findByRiskId(String riskId);
}