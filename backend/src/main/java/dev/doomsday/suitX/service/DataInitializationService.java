package dev.doomsday.suitX.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Service;

import dev.doomsday.suitX.model.Mitigation;
import dev.doomsday.suitX.model.Project;
import dev.doomsday.suitX.model.Risk;
import dev.doomsday.suitX.repository.MitigationRepository;
import dev.doomsday.suitX.repository.ProjectRepository;
import dev.doomsday.suitX.repository.RiskRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DataInitializationService implements CommandLineRunner {

    private final ProjectRepository projectRepository;
    private final RiskRepository riskRepository;
    private final MitigationRepository mitigationRepository;

    @Override
    public void run(String... args) throws Exception {
        initializeProjects();
        initializeRisks();
        initializeMitigations();
    }

    private void initializeProjects() {
        if (projectRepository.count() == 0) {
            Project project1 = new Project();
            project1.setName("Platform Redesign");
            project1.setDescription("Complete redesign of the main platform with modern UI/UX");
            project1.setStatus("ACTIVE");
            project1.setProgressPercentage(50.0);
            project1.setStartDate(LocalDateTime.of(2025, 8, 1, 9, 0));
            project1.setEndDate(LocalDateTime.of(2025, 12, 15, 17, 0));
            project1.setCreatedAt(LocalDateTime.now());
            project1.setUpdatedAt(LocalDateTime.now());
            project1.setCreatedBy("admin");
            project1.setProjectManager("John Smith");

            Project project2 = new Project();
            project2.setName("Mobile MVP");
            project2.setDescription("Development of mobile application minimum viable product");
            project2.setStatus("ACTIVE");
            project2.setProgressPercentage(75.0);
            project2.setStartDate(LocalDateTime.of(2025, 7, 15, 9, 0));
            project2.setEndDate(LocalDateTime.of(2025, 11, 30, 17, 0));
            project2.setCreatedAt(LocalDateTime.now());
            project2.setUpdatedAt(LocalDateTime.now());
            project2.setCreatedBy("admin");
            project2.setProjectManager("Sarah Johnson");

            Project project3 = new Project();
            project3.setName("Data Security Project");
            project3.setDescription("Implementation of comprehensive data security and backup strategies");
            project3.setStatus("ACTIVE");
            project3.setProgressPercentage(95.0);
            project3.setStartDate(LocalDateTime.of(2025, 6, 1, 9, 0));
            project3.setEndDate(LocalDateTime.of(2025, 10, 15, 17, 0));
            project3.setCreatedAt(LocalDateTime.now());
            project3.setUpdatedAt(LocalDateTime.now());
            project3.setCreatedBy("admin");
            project3.setProjectManager("Mike Davis");

            // Save each project individually to debug any issues
            projectRepository.save(project1);
            projectRepository.save(project2);
            projectRepository.save(project3);
            
            // Verify all projects were saved
            long savedProjects = projectRepository.count();
            System.out.println("Projects saved: " + savedProjects);
        }
    }

    private void initializeRisks() {
        if (riskRepository.count() == 0) {
            // Get all projects and ensure we have them
            List<Project> projects = projectRepository.findAll();
            if (projects.size() < 2) {
                throw new RuntimeException("Expected at least 2 projects for risk initialization, found: " + projects.size());
            }

            Risk risk1 = new Risk();
            risk1.setTitle("Scope Creep");
            risk1.setDescription("Requirements expanding beyond original project scope due to stakeholder requests.");
            risk1.setType("scope");
            risk1.setSeverity("HIGH");
            risk1.setStatus("ACTIVE");
            risk1.setProjectId(projects.get(0).getId());
            risk1.setAssignedTo("Project Manager");
            risk1.setCreatedAt(LocalDateTime.now());
            risk1.setUpdatedAt(LocalDateTime.now());
            risk1.setCreatedBy("admin");

            Risk risk2 = new Risk();
            risk2.setTitle("Frontend Int.");
            risk2.setDescription("Integration challenges between frontend components causing deployment delays and functionality issues.");
            risk2.setType("frontend");
            risk2.setSeverity("MEDIUM");
            risk2.setStatus("ACTIVE");
            risk2.setProjectId(projects.get(1).getId());
            risk2.setAssignedTo("Frontend Team Lead");
            risk2.setCreatedAt(LocalDateTime.now());
            risk2.setUpdatedAt(LocalDateTime.now());
            risk2.setCreatedBy("admin");

            Risk risk3 = new Risk();
            risk3.setTitle("Deployment");
            risk3.setDescription("Production deployment failures and environment configuration mismatches affecting system stability.");
            risk3.setType("deployment");
            risk3.setSeverity("HIGH");
            risk3.setStatus("ACTIVE");
            risk3.setProjectId(projects.size() > 2 ? projects.get(2).getId() : projects.get(0).getId());
            risk3.setAssignedTo("DevOps Engineer");
            risk3.setCreatedAt(LocalDateTime.now());
            risk3.setUpdatedAt(LocalDateTime.now());
            risk3.setCreatedBy("admin");

            riskRepository.saveAll(Arrays.asList(risk1, risk2, risk3));
        }
    }

    private void initializeMitigations() {
        if (mitigationRepository.count() == 0) {
            // Get all projects and ensure we have them
            List<Project> projects = projectRepository.findAll();
            if (projects.size() < 2) {
                throw new RuntimeException("Expected at least 2 projects for mitigation initialization, found: " + projects.size());
            }

            Mitigation mitigation1 = new Mitigation();
            mitigation1.setTitle("Scope Management");
            mitigation1.setDescription("Implement strict change control process with approval gates and impact assessments for all scope modifications.");
            mitigation1.setStatus("ACTIVE");
            mitigation1.setPriority("HIGH");
            mitigation1.setAssignee("Project Manager");
            mitigation1.setDueDate(LocalDateTime.of(2025, 10, 15, 17, 0));
            mitigation1.setRelatedRiskId("Scope Creep");
            mitigation1.setProjectId(projects.get(0).getId());
            mitigation1.setCreatedAt(LocalDateTime.now());
            mitigation1.setUpdatedAt(LocalDateTime.now());
            mitigation1.setCreatedBy("admin");
            mitigation1.setProgressPercentage(40.0);

            Mitigation mitigation2 = new Mitigation();
            mitigation2.setTitle("Frontend Integration Testing");
            mitigation2.setDescription("Establish comprehensive integration testing framework with automated CI/CD pipeline validation.");
            mitigation2.setStatus("ACTIVE");
            mitigation2.setPriority("MEDIUM");
            mitigation2.setAssignee("Frontend Team Lead");
            mitigation2.setDueDate(LocalDateTime.of(2025, 10, 20, 17, 0));
            mitigation2.setRelatedRiskId("Frontend Int.");
            mitigation2.setProjectId(projects.get(1).getId());
            mitigation2.setCreatedAt(LocalDateTime.now());
            mitigation2.setUpdatedAt(LocalDateTime.now());
            mitigation2.setCreatedBy("admin");
            mitigation2.setProgressPercentage(60.0);

            Mitigation mitigation3 = new Mitigation();
            mitigation3.setTitle("Deployment Automation");
            mitigation3.setDescription("Create automated deployment pipeline with rollback capabilities and environment validation checks.");
            mitigation3.setStatus("ACTIVE");
            mitigation3.setPriority("HIGH");
            mitigation3.setAssignee("DevOps Engineer");
            mitigation3.setDueDate(LocalDateTime.of(2025, 10, 10, 17, 0));
            mitigation3.setRelatedRiskId("Deployment");
            mitigation3.setProjectId(projects.size() > 2 ? projects.get(2).getId() : projects.get(1).getId());
            mitigation3.setCreatedAt(LocalDateTime.now());
            mitigation3.setUpdatedAt(LocalDateTime.now());
            mitigation3.setCreatedBy("admin");
            mitigation3.setProgressPercentage(80.0);

            Mitigation mitigation4 = new Mitigation();
            mitigation4.setTitle("Code Review Process");
            mitigation4.setDescription("Implement mandatory peer review process with quality gates and automated code analysis.");
            mitigation4.setStatus("COMPLETED");
            mitigation4.setPriority("MEDIUM");
            mitigation4.setAssignee("Tech Lead");
            mitigation4.setDueDate(LocalDateTime.of(2025, 9, 25, 17, 0));
            mitigation4.setRelatedRiskId("Code Quality");
            mitigation4.setProjectId(projects.get(0).getId());
            mitigation4.setCreatedAt(LocalDateTime.now());
            mitigation4.setUpdatedAt(LocalDateTime.now());
            mitigation4.setCompletedAt(LocalDateTime.of(2025, 9, 20, 14, 30));
            mitigation4.setCreatedBy("admin");
            mitigation4.setProgressPercentage(100.0);

            Mitigation mitigation5 = new Mitigation();
            mitigation5.setTitle("Backup Strategy");
            mitigation5.setDescription("Establish comprehensive backup and disaster recovery procedures with regular testing.");
            mitigation5.setStatus("PLANNED");
            mitigation5.setPriority("LOW");
            mitigation5.setAssignee("System Admin");
            mitigation5.setDueDate(LocalDateTime.of(2025, 11, 1, 17, 0));
            mitigation5.setRelatedRiskId("Data Loss");
            mitigation5.setProjectId(projects.size() > 2 ? projects.get(2).getId() : projects.get(0).getId());
            mitigation5.setCreatedAt(LocalDateTime.now());
            mitigation5.setUpdatedAt(LocalDateTime.now());
            mitigation5.setCreatedBy("admin");
            mitigation5.setProgressPercentage(0.0);

            mitigationRepository.saveAll(Arrays.asList(mitigation1, mitigation2, mitigation3, mitigation4, mitigation5));
        }
    }
}