package com.suitx.controller;

import com.suitx.dto.AIDtos.*;
import com.suitx.service.AiService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
public class AiController {

    private final AiService ai;

    @PostMapping(value = "/recommendations", consumes = MediaType.APPLICATION_JSON_VALUE)
    public Mono<RecommendationResponse> recommendations(@RequestBody RecommendationRequest req) {
        return ai.recommendMitigations(req);
    }
}