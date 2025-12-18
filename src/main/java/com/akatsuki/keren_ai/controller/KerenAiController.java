package com.akatsuki.keren_ai.controller;

import com.akatsuki.keren_ai.domain.Chunk;
import com.akatsuki.keren_ai.service.KerenAiService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.chat.client.ChatClientResponse;
import org.springframework.ai.document.Document;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@Slf4j
@RequestMapping("/api/v1/keren-ai")
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
    public Document addChunks(@RequestBody Chunk chunk) {
        return kerenAiService.addChunk(chunk);
    }

    @PostMapping("/chunks/batch")
    public List<Document> addChunks(@RequestBody List<Chunk> chunks) {
        return kerenAiService.addChunks(chunks);
    }

    @GetMapping("/chunks")
    public List<Document> getChunks() {
        return kerenAiService.getChunks();
    }

    @DeleteMapping("/chunks/{id}")
    public Document deleteChunk(@PathVariable String id) {
        return kerenAiService.deleteChunk(id);
    }

    @PostMapping("/embeddings")
    public List<Document> getSimilarEmbeddings(@RequestBody String query) {
        return kerenAiService.getSimilarEmbeddings(query);
    }
}
