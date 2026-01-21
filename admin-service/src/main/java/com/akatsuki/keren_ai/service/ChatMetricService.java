package com.akatsuki.keren_ai.service;

import com.akatsuki.keren_ai.domain.ChatMetricSummary;
import com.akatsuki.keren_ai.entity.ChatMetric;
import com.akatsuki.keren_ai.repository.ChatMetricRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ChatMetricService {
    private final ChatMetricRepository chatMetricRepository;

    public ChatMetricService(ChatMetricRepository chatMetricRepository) {
        this.chatMetricRepository = chatMetricRepository;
    }

    public List<ChatMetric> getAllMetrics() {
        return chatMetricRepository.findAll();
    }

    public ChatMetric saveMetric(ChatMetric metric) {
        return chatMetricRepository.save(metric);
    }

    public ChatMetricSummary getMetricSummary() {
        return chatMetricRepository.getMetricSummary();
    }
}
