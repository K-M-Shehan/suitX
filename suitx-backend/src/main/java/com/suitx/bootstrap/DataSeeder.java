package com.suitx.bootstrap;

import com.suitx.model.Project;
import com.suitx.model.Risk;
import com.suitx.repo.ProjectRepository;
import com.suitx.repo.RiskRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.List;
import java.util.Random;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final ProjectRepository projectRepo;
    private final RiskRepository riskRepo;

    @Override
    public void run(String... args) {
        if (projectRepo.count() > 0 || riskRepo.count() > 0) return;

        Project p1 = projectRepo.save(Project.builder().name("Apollo").owner("Ava").status("Active").build());
        Project p2 = projectRepo.save(Project.builder().name("Zephyr").owner("Noah").status("Active").build());
        Project p3 = projectRepo.save(Project.builder().name("Orion").owner("Liam").status("On Hold").build());

        Random rnd = new Random();
        List<String> cats = List.of("Schedule","Budget","Scope","Quality");

        for (int i = 0; i < 28; i++) {
            String pid = switch (i % 3) { case 0 -> p1.getId(); case 1 -> p2.getId(); default -> p3.getId(); };
            String cat = cats.get(rnd.nextInt(cats.size()));
            int likelihood = 1 + rnd.nextInt(5);
            int impact = 1 + rnd.nextInt(5);
            String status = rnd.nextDouble() < 0.2 ? "Closed" : (rnd.nextDouble() < 0.6 ? "Open" : "Mitigating");

            Risk r = Risk.builder()
                    .projectId(pid)
                    .title(cat + " risk #" + (i+1))
                    .description("Auto-seeded " + cat + " risk description " + (i+1))
                    .category(cat)
                    .likelihood(likelihood)
                    .impact(impact)
                    .status(status)
                    .build();

            // spread createdAt across last 6 months
            int monthsBack = rnd.nextInt(6);
            LocalDate date = LocalDate.now().minusMonths(monthsBack).withDayOfMonth(1 + rnd.nextInt(25));
            r.setCreatedAt(date.atStartOfDay(ZoneId.systemDefault()).toInstant());

            riskRepo.save(r);
        }
    }
}