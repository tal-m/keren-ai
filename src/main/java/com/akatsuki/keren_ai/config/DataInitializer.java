package com.akatsuki.keren_ai.config;

import com.akatsuki.keren_ai.domain.Chunk;
import com.akatsuki.keren_ai.service.KerenAiService;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.stereotype.Component;

import java.io.InputStream;
import java.util.List;

@Slf4j
@Component
public class DataInitializer implements CommandLineRunner {

    private final KerenAiService kerenAiService;
    private final ResourceLoader resourceLoader;
    private final ObjectMapper objectMapper;

    public DataInitializer(KerenAiService kerenAiService,
                           ResourceLoader resourceLoader,
                           ObjectMapper objectMapper) {
        this.kerenAiService = kerenAiService;
        this.resourceLoader = resourceLoader;
        this.objectMapper = objectMapper;
    }

    @Override
    public void run(String... args) throws Exception {
        log.info("Checking if Vector Store needs initial data...");

        if (kerenAiService.getChunks().isEmpty()) {
            log.info("Vector Store is empty. Starting ingestion from JSON file.");

            try {
                Resource resource = resourceLoader.getResource("classpath:KerenOrDetails.json");

                try (InputStream inputStream = resource.getInputStream()) {
                    List<Chunk> chunks = objectMapper.readValue(inputStream,
                            new TypeReference<List<Chunk>>() {});

                    kerenAiService.addChunks(chunks);

                    log.info("Successfully loaded {} chunks into the Vector Store.", chunks.size());
                }
            } catch (Exception e) {
                log.error("Error loading initial data: {}", e.getMessage());
            }
        } else {
            log.info("Vector Store already contains data. Skipping ingestion.");
        }
    }
}