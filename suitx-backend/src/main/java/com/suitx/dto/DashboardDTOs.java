package com.suitx.dto;

import lombok.*;

import java.util.List;

public class DashboardDTOs {

    @Data @Builder @AllArgsConstructor @NoArgsConstructor
    public static class Summary {
        private long totalProjects;
        private long openRisks;
        private long highSeverityRisks;
        private long breaches;
        private List<TrendPoint> riskTrend;
        private List<CategoryCount> byCategory;
    }

    @Data @Builder @AllArgsConstructor @NoArgsConstructor
    public static class TrendPoint {
        private String date; // YYYY-MM
        private long risks;
    }

    @Data @Builder @AllArgsConstructor @NoArgsConstructor
    public static class CategoryCount {
        private String category;
        private long count;
    }
}