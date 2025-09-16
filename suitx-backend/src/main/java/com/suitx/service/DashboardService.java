package com.suitx.service;

import com.suitx.dto.DashboardDTOs.*;
import com.suitx.model.Risk;
import com.suitx.repo.ProjectRepository;
import com.suitx.repo.RiskRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.*;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final ProjectRepository projectRepo;
    private final RiskRepository riskRepo;

    public Summary getSummary() {
        long totalProjects = projectRepo.count();
        List<Risk> risks = riskRepo.findAll();

        long openRisks = risks.stream().filter(r -> !"Closed".equalsIgnoreCase(r.getStatus())).count();
        long highSeverity = risks.stream().filter(r -> r.getSeverityScore() >= 16).count(); // 4x4 baseline
        long breaches = risks.stream()
                .filter(r -> r.getSeverityScore() >= 20) // "critical"
                .count();

        // Last 6 months trend by createdAt
        List<TrendPoint> trend = buildTrend(risks);

        // By category counts
        Map<String, Long> byCat = risks.stream().collect(Collectors.groupingBy(
                r -> Optional.ofNullable(r.getCategory()).orElse("Uncategorized"),
                Collectors.counting()
        ));
        List<CategoryCount> catList = byCat.entrySet().stream()
                .map(e -> CategoryCount.builder().category(e.getKey()).count(e.getValue()).build())
                .sorted(Comparator.comparing(CategoryCount::getCategory))
                .toList();

        return Summary.builder()
                .totalProjects(totalProjects)
                .openRisks(openRisks)
                .highSeverityRisks(highSeverity)
                .breaches(breaches)
                .riskTrend(trend)
                .byCategory(catList)
                .build();
    }

    private List<TrendPoint> buildTrend(List<Risk> risks) {
        LocalDate now = LocalDate.now();
        List<YearMonth> last6 = new ArrayList<>();
        for (int i = 5; i >= 0; i--) {
            last6.add(YearMonth.from(now.minusMonths(i)));
        }
        Map<YearMonth, Long> map = new HashMap<>();
        for (YearMonth ym : last6) map.put(ym, 0L);

        for (Risk r : risks) {
            if (r.getCreatedAt() == null) continue;
            YearMonth ym = YearMonth.from(r.getCreatedAt().atZone(ZoneId.systemDefault()));
            if (map.containsKey(ym)) {
                map.put(ym, map.get(ym) + 1);
            }
        }
        DateTimeFormatter fmt = DateTimeFormatter.ofPattern("yyyy-MM");
        return last6.stream()
                .map(ym -> new TrendPoint(fmt.format(ym.atDay(1)), map.getOrDefault(ym, 0L)))
                .toList();
    }
}