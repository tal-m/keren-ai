package com.akatsuki.keren_ai.domain;

public record ChatMetricSummary(
        Double avgUserTokens,
        Double avgAiTokens,
        Double avgTotalTokens,
        Long totalInteractions
) {}