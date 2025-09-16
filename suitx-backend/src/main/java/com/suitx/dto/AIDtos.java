package com.suitx.dto;

import lombok.*;

import java.util.List;

public class AIDtos {

    @Data @Builder @AllArgsConstructor @NoArgsConstructor
    public static class RiskInput {
        private String title;
        private String description;
        private String category;
        private Integer likelihood;
        private Integer impact;
        private String status;
    }

    @Data @Builder @AllArgsConstructor @NoArgsConstructor
    public static class RecommendationRequest {
        private String projectName;
        private String projectDescription;
        private List<RiskInput> risks;
    }

    @Data @Builder @AllArgsConstructor @NoArgsConstructor
    public static class RecommendationResponse {
        private String recommendations; // markdown/text from LLM
    }
}