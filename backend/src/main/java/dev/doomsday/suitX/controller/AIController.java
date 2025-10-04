package dev.doomsday.suitX.controller;

import dev.doomsday.suitX.dto.AIAnalysisRequest;
import dev.doomsday.suitX.dto.AIAnalysisResponse;
import dev.doomsday.suitX.service.GeminiAIService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/ai")
@CrossOrigin(origins = "http://localhost:5173")
public class AIController {

    @Autowired
    private GeminiAIService geminiAIService;

    @PostMapping("/analyze-risks")
    public ResponseEntity<?> analyzeProjectRisks(
            @RequestBody AIAnalysisRequest request,
            Authentication authentication) {
        
        try {
            // Validate request
            if (request.getProjectName() == null || request.getProjectName().trim().isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(Map.of("error", "Project name is required"));
            }

            if (request.getProjectDescription() == null || request.getProjectDescription().trim().isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(Map.of("error", "Project description is required"));
            }

            // Set defaults for missing fields
            if (request.getTeamSize() == null) {
                request.setTeamSize(5);
            }
            if (request.getComplexity() == null) {
                request.setComplexity("MEDIUM");
            }
            if (request.getProjectType() == null) {
                request.setProjectType("Software Development");
            }

            // Call AI service
            AIAnalysisResponse response = geminiAIService.analyzeProjectRisks(request);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of(
                    "error", "Failed to analyze project risks",
                    "message", e.getMessage()
                ));
        }
    }

    @GetMapping("/health")
    public ResponseEntity<?> healthCheck() {
        return ResponseEntity.ok(Map.of(
            "status", "UP",
            "service", "AI Risk Analysis Service",
            "timestamp", System.currentTimeMillis()
        ));
    }
}