package dev.doomsday.suitX.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import dev.doomsday.suitX.dto.MitigationDto;
import dev.doomsday.suitX.dto.MitigationSummaryDto;
import dev.doomsday.suitX.service.MitigationService;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/mitigations")
@RequiredArgsConstructor
public class MitigationController {

    private final MitigationService mitigationService;

    @GetMapping
    public ResponseEntity<List<MitigationDto>> getAllMitigations() {
        List<MitigationDto> mitigations = mitigationService.getAllMitigations();
        return ResponseEntity.ok(mitigations);
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<MitigationDto>> getMitigationsByStatus(@PathVariable String status) {
        List<MitigationDto> mitigations = mitigationService.getMitigationsByStatus(status.toUpperCase());
        return ResponseEntity.ok(mitigations);
    }

    @GetMapping("/priority/{priority}")
    public ResponseEntity<List<MitigationDto>> getMitigationsByPriority(@PathVariable String priority) {
        List<MitigationDto> mitigations = mitigationService.getMitigationsByPriority(priority.toUpperCase());
        return ResponseEntity.ok(mitigations);
    }

    @GetMapping("/assignee/{assignee}")
    public ResponseEntity<List<MitigationDto>> getMitigationsByAssignee(@PathVariable String assignee) {
        List<MitigationDto> mitigations = mitigationService.getMitigationsByAssignee(assignee);
        return ResponseEntity.ok(mitigations);
    }

    @GetMapping("/project/{projectId}")
    public ResponseEntity<List<MitigationDto>> getMitigationsByProject(@PathVariable String projectId) {
        List<MitigationDto> mitigations = mitigationService.getMitigationsByProject(projectId);
        return ResponseEntity.ok(mitigations);
    }

    @GetMapping("/{id}")
    public ResponseEntity<MitigationDto> getMitigationById(@PathVariable String id) {
        Optional<MitigationDto> mitigation = mitigationService.getMitigationById(id);
        return mitigation.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<MitigationDto> createMitigation(@RequestBody MitigationDto mitigationDto) {
        try {
            MitigationDto createdMitigation = mitigationService.createMitigation(mitigationDto);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdMitigation);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<MitigationDto> updateMitigation(@PathVariable String id, @RequestBody MitigationDto mitigationDto) {
        try {
            MitigationDto updatedMitigation = mitigationService.updateMitigation(id, mitigationDto);
            return ResponseEntity.ok(updatedMitigation);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMitigation(@PathVariable String id) {
        try {
            mitigationService.deleteMitigation(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PatchMapping("/{id}/complete")
    public ResponseEntity<MitigationDto> markAsCompleted(@PathVariable String id) {
        try {
            MitigationDto completedMitigation = mitigationService.markAsCompleted(id);
            return ResponseEntity.ok(completedMitigation);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PatchMapping("/{id}/progress")
    public ResponseEntity<MitigationDto> updateProgress(@PathVariable String id, @RequestBody Double progress) {
        try {
            MitigationDto updatedMitigation = mitigationService.updateProgress(id, progress);
            return ResponseEntity.ok(updatedMitigation);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/summary")
    public ResponseEntity<MitigationSummaryDto> getMitigationSummary() {
        MitigationSummaryDto summary = mitigationService.getMitigationSummary();
        return ResponseEntity.ok(summary);
    }
}