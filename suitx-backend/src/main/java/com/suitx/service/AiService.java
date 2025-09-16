package com.suitx.service;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.suitx.dto.AIDtos.*;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AiService {

    private final WebClient openAIClient;

    @Value("${app.ai.openai.model:gpt-4o-mini}")
    private String model;

    public Mono<RecommendationResponse> recommendMitigations(RecommendationRequest req) {
        String prompt = buildPrompt(req);

        ChatCompletionsRequest body = new ChatCompletionsRequest(
                model,
                List.of(
                        Map.of("role", "system", "content", "You are a senior project risk manager. Return concise, actionable mitigation steps."),
                        Map.of("role", "user", "content", prompt)
                ),
                0.2
        );

        return openAIClient.post()
                .uri("/chat/completions")
                .bodyValue(body)
                .retrieve()
                .bodyToMono(ChatCompletionsResponse.class)
                .map(resp -> {
                    String content = resp.choices != null && !resp.choices.isEmpty()
                            ? resp.choices.get(0).message.content
                            : "No recommendation generated.";
                    return RecommendationResponse.builder().recommendations(content).build();
                });
    }

    private String buildPrompt(RecommendationRequest req) {
        StringBuilder sb = new StringBuilder();
        sb.append("Project: ").append(req.getProjectName()).append("\n");
        if (req.getProjectDescription() != null) sb.append("Description: ").append(req.getProjectDescription()).append("\n");
        sb.append("Risks:\n");
        if (req.getRisks() != null) {
            int i = 1;
            for (RiskInput r : req.getRisks()) {
                sb.append(i++).append(") [").append(nullSafe(r.getCategory())).append("] ")
                        .append(r.getTitle()).append(" — L").append(n(r.getLikelihood())).append(" x I").append(n(r.getImpact())).append("\n")
                        .append("   ").append(nullSafe(r.getDescription())).append("\n");
            }
        }
        sb.append("\nReturn mitigation plan with steps, owners, and suggested timeline. Use bullet points.");
        return sb.toString();
    }

    private String nullSafe(String s) { return s == null ? "" : s; }
    private int n(Integer i) { return i == null ? 0 : i; }

    // Minimal DTOs for OpenAI API
    public record ChatCompletionsRequest(
            String model,
            List<Map<String, Object>> messages,
            @JsonProperty("temperature") double temperature
    ) {}

    @Data
    public static class ChatCompletionsResponse {
        public List<Choice> choices;
        @Data public static class Choice {
            public Message message;
        }
        @Data public static class Message {
            public String role;
            public String content;
        }
    }
}