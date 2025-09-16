package com.suitx.controller;

import com.suitx.dto.DashboardDTOs.Summary;
import com.suitx.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService service;

    @GetMapping("/summary")
    public Summary getSummary() {
        return service.getSummary();
    }
}