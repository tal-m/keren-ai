package com.akatsuki.keren_ai.repository;

import com.akatsuki.keren_ai.domain.ChatMetricSummary;
import com.akatsuki.keren_ai.entity.ChatMetric;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface ChatMetricRepository extends JpaRepository<ChatMetric, UUID> {

    @Query("SELECT new com.akatsuki.keren_ai.domain.ChatMetricSummary(" +
            "AVG(m.userTokens), AVG(m.aiTokens), AVG(m.totalTokens), COUNT(m)) " +
            "FROM ChatMetric m")
    ChatMetricSummary getMetricSummary();
}
