package dev.doomsday.suitX.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import dev.doomsday.suitX.dto.RiskDto;
import dev.doomsday.suitX.dto.RiskSummaryDto;
import dev.doomsday.suitX.service.RiskService;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/risks")
@RequiredArgsConstructor
public class RiskController {

    private final RiskService riskService;

    @GetMapping
    public ResponseEntity<List<RiskDto>> getAllRisks() {
        List<RiskDto> risks = riskService.getAllRisks();
        return ResponseEntity.ok(risks);
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<RiskDto>> getRisksByStatus(@PathVariable String status) {
        List<RiskDto> risks = riskService.getRisksByStatus(status.toUpperCase());
        return ResponseEntity.ok(risks);
    }

    @GetMapping("/project/{projectId}")
    public ResponseEntity<List<RiskDto>> getRisksByProject(@PathVariable String projectId) {
        List<RiskDto> risks = riskService.getRisksByProject(projectId);
        return ResponseEntity.ok(risks);
    }

    @GetMapping("/{id}")
    public ResponseEntity<RiskDto> getRiskById(@PathVariable String id) {
        Optional<RiskDto> risk = riskService.getRiskById(id);
        return risk.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<RiskDto> createRisk(@RequestBody RiskDto riskDto) {
        try {
            RiskDto createdRisk = riskService.createRisk(riskDto);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdRisk);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<RiskDto> updateRisk(@PathVariable String id, @RequestBody RiskDto riskDto) {
        try {
            RiskDto updatedRisk = riskService.updateRisk(id, riskDto);
            return ResponseEntity.ok(updatedRisk);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRisk(@PathVariable String id) {
        try {
            riskService.deleteRisk(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PatchMapping("/{id}/resolve")
    public ResponseEntity<RiskDto> resolveRisk(@PathVariable String id) {
        try {
            RiskDto resolvedRisk = riskService.resolveRisk(id);
            return ResponseEntity.ok(resolvedRisk);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PatchMapping("/{id}/ignore")
    public ResponseEntity<RiskDto> ignoreRisk(@PathVariable String id) {
        try {
            RiskDto ignoredRisk = riskService.ignoreRisk(id);
            return ResponseEntity.ok(ignoredRisk);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/summary")
    public ResponseEntity<RiskSummaryDto> getRiskSummary(Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        String username = authentication.getName();
        RiskSummaryDto summary = riskService.getRiskSummary(username);
        return ResponseEntity.ok(summary);
    }
}