package com.akatsuki.keren_ai.controller;

import com.akatsuki.keren_ai.domain.ChatMetricSummary;
import com.akatsuki.keren_ai.domain.Chunk;
import com.akatsuki.keren_ai.entity.ChatMetric;
import com.akatsuki.keren_ai.service.KerenAiService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.document.Document;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@Slf4j
@RequestMapping("/admin")
public class KerenAiController {
    private final KerenAiService kerenAiService;

    public KerenAiController(KerenAiService kerenAiService) {
        this.kerenAiService = kerenAiService;
    }

    @PostMapping("/chat")
    public String userInput(@RequestBody String userInput) {
        log.info("Received user input: {}", userInput);
        return kerenAiService.userInput(userInput);
    }

    @PostMapping("/chunks")
    public Document addChunks(Authentication authentication, @RequestBody Chunk chunk) {
        return kerenAiService.addChunk(chunk);
    }

    @PostMapping("/chunks/batch")
    public List<Document> addChunks(Authentication authentication, @RequestBody List<Chunk> chunks) {
        return kerenAiService.addChunks(chunks);
    }

    @PutMapping("/chunks/{id}")
    public Document updateChunk(Authentication authentication, @PathVariable String id, @RequestBody Chunk chunk) {
        return kerenAiService.updateChunk(id, chunk);
    }

    @GetMapping("/chunks")
    public List<Document> getChunks(Authentication authentication) {
        return kerenAiService.getChunks();
    }

    @DeleteMapping("/chunks/{id}")
    public Document deleteChunk(Authentication authentication, @PathVariable String id) {
        return kerenAiService.deleteChunk(id);
    }

    @PostMapping("/embeddings")
    public List<Document> getSimilarEmbeddings(@RequestBody String query) {
        return kerenAiService.getSimilarEmbeddings(query);
    }

    @GetMapping("/metrics")
    public List<ChatMetric> getAllMetrics(Authentication authentication) {
        return kerenAiService.getAllMetrics();
    }

    @GetMapping("/metrics/summary")
    public ChatMetricSummary getMetricSummary(Authentication authentication) {
        return kerenAiService.getMetricSummary();
    }
}
