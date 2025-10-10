package dev.doomsday.suitX.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import dev.doomsday.suitX.dto.*;
import dev.doomsday.suitX.model.Project;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
public class GeminiAIService {

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    @Value("${gemini.api.key}")
    private String apiKey;

    @Value("${gemini.api.url:https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent}")
    private String apiUrl;

    public GeminiAIService(ObjectMapper objectMapper) {
        this.restTemplate = new RestTemplate();
        this.objectMapper = objectMapper;
    }

    /**
     * Analyze risks from a form request (manual analysis)
     */
    public AIAnalysisResponse analyzeProjectRisks(AIAnalysisRequest request) {
        try {
            String prompt = buildRiskAnalysisPrompt(request);
            String geminiResponse = callGeminiAPI(prompt);
            return parseAIResponse(geminiResponse, request);
        } catch (Exception e) {
            return createErrorResponse(request, e.getMessage());
        }
    }

    /**
     * Analyze risks from an existing project (automatic analysis)
     */
    public AIAnalysisResponse analyzeExistingProject(Project project) {
        try {
            String prompt = buildProjectRiskAnalysisPrompt(project);
            String geminiResponse = callGeminiAPI(prompt);
            AIAnalysisResponse response = parseAIResponse(geminiResponse, null);
            return response;
        } catch (Exception e) {
            return createErrorResponse(null, e.getMessage());
        }
    }

    private String buildProjectRiskAnalysisPrompt(Project project) {
        StringBuilder prompt = new StringBuilder("""
            You are an expert project management consultant and risk analyst. Analyze the following project and provide a comprehensive risk assessment with mitigation strategies.

            PROJECT DETAILS:
            """);
        
        prompt.append("- Name: ").append(project.getName()).append("\n");
        prompt.append("- Description: ").append(project.getDescription()).append("\n");
        if (project.getStartDate() != null) {
            prompt.append("- Start Date: ").append(project.getStartDate()).append("\n");
        }
        if (project.getEndDate() != null) {
            prompt.append("- End Date: ").append(project.getEndDate()).append("\n");
        }
        prompt.append("- Status: ").append(project.getStatus()).append("\n");
        
        if (project.getTags() != null && !project.getTags().isEmpty()) {
            prompt.append("- Tags: ").append(String.join(", ", project.getTags())).append("\n");
        }
        
        prompt.append("\n").append("""
            ANALYSIS REQUIREMENTS:
            1. Identify 5-8 potential risks across different categories (Technical, Resource, Schedule, Financial, Scope, Quality)
            2. For each risk, provide:
               - A clear title
               - Detailed description of the risk
               - Category classification
               - Priority level (HIGH/MEDIUM/LOW)
               - Probability of occurrence (0-100)
               - Confidence score (0.0-1.0) indicating your confidence in this assessment
            3. Provide 3-5 mitigation strategies for each risk
            4. Each mitigation should include implementation effort (LOW/MEDIUM/HIGH)

            RESPONSE FORMAT (JSON):
            {
              "identifiedRisks": [
                {
                  "riskId": "R1",
                  "title": "Risk title",
                  "description": "Detailed description",
                  "category": "TECHNICAL|RESOURCE|SCHEDULE|FINANCIAL|SCOPE|QUALITY",
                  "priority": "HIGH|MEDIUM|LOW",
                  "probability": 75,
                  "confidenceScore": 0.85
                }
              ],
              "suggestedMitigations": [
                {
                  "mitigationId": "M1",
                  "riskId": "R1",
                  "description": "Mitigation description",
                  "implementationEffort": "LOW|MEDIUM|HIGH"
                }
              ]
            }

            Provide ONLY the JSON response, no additional text.
            """);
        
        return prompt.toString();
    }

    private String buildRiskAnalysisPrompt(AIAnalysisRequest request) {
        return String.format("""
            You are an expert project management consultant and risk analyst. Analyze the following project and provide a comprehensive risk assessment with mitigation strategies.

            PROJECT DETAILS:
            - Name: %s
            - Description: %s
            - Type: %s
            - Timeline: %s
            - Budget: %s
            - Team Size: %d people
            - Technology: %s
            - Industry: %s
            - Complexity: %s
            - Specific Concerns: %s

            Please provide a detailed analysis in the following JSON format (respond ONLY with valid JSON, no additional text):

            {
                "identifiedRisks": [
                    {
                        "riskId": "RISK_001",
                        "title": "Brief risk title",
                        "description": "Detailed risk description",
                        "category": "TECHNICAL|RESOURCE|TIMELINE|BUDGET|EXTERNAL",
                        "priority": "LOW|MEDIUM|HIGH|CRITICAL", 
                        "probability": 75.5,
                        "impact": "LOW|MEDIUM|HIGH|CRITICAL",
                        "earlyWarningIndicators": ["indicator1", "indicator2"],
                        "confidenceScore": 0.85,
                        "reasoning": "Why this risk exists"
                    }
                ],
                "suggestedMitigations": [
                    {
                        "mitigationId": "MIT_001",
                        "riskId": "RISK_001", 
                        "title": "Mitigation strategy title",
                        "description": "Detailed mitigation description",
                        "type": "PREVENTIVE|DETECTIVE|CORRECTIVE|CONTINGENT",
                        "implementationEffort": "LOW|MEDIUM|HIGH",
                        "costEstimate": "LOW|MEDIUM|HIGH",
                        "timelineWeeks": "2-4",
                        "successMetrics": ["metric1", "metric2"],
                        "responsibleRoles": ["Project Manager", "Tech Lead"],
                        "effectivenessScore": 0.8,
                        "implementationSteps": "Step-by-step implementation guide"
                    }
                ],
                "projectInsights": {
                    "overallRiskLevel": "LOW|MEDIUM|HIGH|CRITICAL",
                    "keyStrengths": ["strength1", "strength2"],
                    "primaryConcerns": ["concern1", "concern2"], 
                    "recommendations": ["recommendation1", "recommendation2"],
                    "totalRisksIdentified": 5,
                    "riskDistribution": "{\\"TECHNICAL\\": 2, \\"RESOURCE\\": 1, \\"TIMELINE\\": 2}",
                    "complexity": "MEDIUM",
                    "successProbability": "75%%"
                }
            }

            Focus on:
            1. Identify 5-10 most relevant risks for this specific project
            2. Provide actionable mitigation strategies 
            3. Consider the project context (timeline, budget, team size, technology)
            4. Be specific and practical in recommendations
            5. Assign realistic probability and impact scores
            """, 
            request.getProjectName(),
            request.getProjectDescription(),
            request.getProjectType(),
            request.getTimeline(), 
            request.getBudget(),
            request.getTeamSize() != null ? request.getTeamSize() : 5,
            request.getTechnologyStack(),
            request.getIndustry(),
            request.getComplexity(),
            request.getSpecificConcerns() != null ? request.getSpecificConcerns() : "None specified"
        );
    }

    private String callGeminiAPI(String prompt) {
        Map<String, Object> requestBody = Map.of(
            "contents", List.of(
                Map.of("parts", List.of(
                    Map.of("text", prompt)
                ))
            ),
            "generationConfig", Map.of(
                "temperature", 0.7,
                "topK", 40,
                "topP", 0.95,
                "maxOutputTokens", 16384
            ),
            "safetySettings", List.of(
                Map.of("category", "HARM_CATEGORY_HARASSMENT", "threshold", "BLOCK_MEDIUM_AND_ABOVE"),
                Map.of("category", "HARM_CATEGORY_HATE_SPEECH", "threshold", "BLOCK_MEDIUM_AND_ABOVE"),
                Map.of("category", "HARM_CATEGORY_SEXUALLY_EXPLICIT", "threshold", "BLOCK_MEDIUM_AND_ABOVE"),
                Map.of("category", "HARM_CATEGORY_DANGEROUS_CONTENT", "threshold", "BLOCK_MEDIUM_AND_ABOVE")
            )
        );

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        
        HttpEntity<Map<String, Object>> request = new HttpEntity<>(requestBody, headers);
        
        String response = restTemplate.exchange(
            apiUrl + "?key=" + apiKey,
            HttpMethod.POST,
            request,
            String.class
        ).getBody();

        return extractTextFromGeminiResponse(response);
    }

    private String extractTextFromGeminiResponse(String response) {
        try {
            JsonNode jsonResponse = objectMapper.readTree(response);
            return jsonResponse.at("/candidates/0/content/parts/0/text").asText();
        } catch (Exception e) {
            throw new RuntimeException("Failed to parse Gemini API response: " + e.getMessage());
        }
    }

    private AIAnalysisResponse parseAIResponse(String aiResponse, AIAnalysisRequest request) {
        try {
            // Clean the response (remove any markdown formatting)
            String cleanJson = aiResponse.trim();
            
            // Remove markdown code fences
            if (cleanJson.startsWith("```json")) {
                cleanJson = cleanJson.substring(7);
            } else if (cleanJson.startsWith("```")) {
                cleanJson = cleanJson.substring(3);
            }
            
            if (cleanJson.endsWith("```")) {
                cleanJson = cleanJson.substring(0, cleanJson.length() - 3);
            }
            
            cleanJson = cleanJson.trim();

            JsonNode jsonNode = objectMapper.readTree(cleanJson);
            
            AIAnalysisResponse response = new AIAnalysisResponse();
            response.setAnalysisId(UUID.randomUUID().toString());
            response.setProjectName(request != null ? request.getProjectName() : "Auto-analyzed Project");
            response.setAnalysisTimestamp(LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));
            response.setStatus("SUCCESS");
            response.setConfidenceScore(0.85);

            // Parse risks
            List<AIRiskAssessment> risks = new ArrayList<>();
            JsonNode risksNode = jsonNode.get("identifiedRisks");
            if (risksNode != null && risksNode.isArray()) {
                for (JsonNode riskNode : risksNode) {
                    AIRiskAssessment risk = objectMapper.treeToValue(riskNode, AIRiskAssessment.class);
                    risks.add(risk);
                }
            }
            response.setIdentifiedRisks(risks);

            // Parse mitigations
            List<AIMitigationStrategy> mitigations = new ArrayList<>();
            JsonNode mitigationsNode = jsonNode.get("suggestedMitigations");
            if (mitigationsNode != null && mitigationsNode.isArray()) {
                for (JsonNode mitigationNode : mitigationsNode) {
                    AIMitigationStrategy mitigation = objectMapper.treeToValue(mitigationNode, AIMitigationStrategy.class);
                    mitigations.add(mitigation);
                }
            }
            response.setSuggestedMitigations(mitigations);

            // Parse insights
            JsonNode insightsNode = jsonNode.get("projectInsights");
            if (insightsNode != null) {
                AIProjectInsights insights = objectMapper.treeToValue(insightsNode, AIProjectInsights.class);
                response.setProjectInsights(insights);
            }

            return response;

        } catch (Exception e) {
            return createErrorResponse(request, "Failed to parse AI response: " + e.getMessage());
        }
    }

    private AIAnalysisResponse createErrorResponse(AIAnalysisRequest request, String errorMessage) {
        AIAnalysisResponse response = new AIAnalysisResponse();
        response.setAnalysisId(UUID.randomUUID().toString());
        response.setProjectName(request != null ? request.getProjectName() : "Unknown Project");
        response.setAnalysisTimestamp(LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));
        response.setStatus("ERROR");
        response.setConfidenceScore(0.0);
        response.setIdentifiedRisks(new ArrayList<>());
        response.setSuggestedMitigations(new ArrayList<>());
        
        AIProjectInsights errorInsights = new AIProjectInsights();
        errorInsights.setOverallRiskLevel("UNKNOWN");
        errorInsights.setKeyStrengths(new String[]{"Analysis not available"});
        errorInsights.setPrimaryConcerns(new String[]{"Error: " + errorMessage});
        errorInsights.setRecommendations(new String[]{"Please try again or contact support"});
        errorInsights.setTotalRisksIdentified(0);
        
        response.setProjectInsights(errorInsights);
        return response;
    }
}