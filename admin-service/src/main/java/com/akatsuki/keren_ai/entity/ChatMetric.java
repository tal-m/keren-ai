package com.akatsuki.keren_ai.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;
import lombok.*;

@Entity
@Table(name = "chat_metrics")
@Getter
@NoArgsConstructor
public class ChatMetric {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    @Column(columnDefinition = "TEXT")
    private String userInput;

    @Column(columnDefinition = "TEXT")
    private String aiResponse;

    private Integer userTokens;
    private Integer aiTokens;
    private Integer totalTokens;

    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    @Builder
    public ChatMetric(String userInput, String aiResponse, Integer userTokens, Integer aiTokens, Integer totalTokens) {
        this.userInput = userInput;
        this.aiResponse = aiResponse;
        this.userTokens = userTokens;
        this.aiTokens = aiTokens;
        this.totalTokens = totalTokens;
    }

}