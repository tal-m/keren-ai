package com.akatsuki.keren_ai.config;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.model.ChatModel;
import org.springframework.ai.openai.OpenAiChatModel;
import org.springframework.ai.openai.OpenAiChatOptions;
import org.springframework.ai.openai.api.OpenAiApi;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.beans.factory.annotation.Qualifier;

@Configuration
public class LlmConfig {

//    @Bean
//    @Qualifier("openAiChatClient")
//    public ChatClient openAiChatClient(ChatModel openAiChatModel) {
//        return ChatClient.builder(openAiChatModel).build();
//    }

    @Bean
    public ChatClient groqChatClient(@Qualifier("groqChatModel") ChatModel groqChatModel) {
        return ChatClient.builder(groqChatModel).build();
    }

    @Bean
    public ChatModel groqChatModel(
            @Value("${groq.api.key}") String apiKey,
            @Value("${groq.base.url}") String baseUrl,
            @Value("${groq.model}") String model,
            @Value("${groq.temperature}") double temperature) {

        OpenAiApi openAiApi = openAiApi(apiKey, baseUrl);

        OpenAiChatOptions options = OpenAiChatOptions.builder()
                .model(model)
                .temperature(temperature)
                .build();

        return OpenAiChatModel.builder()
                .openAiApi(openAiApi)
                .defaultOptions(options)
                .build();
    }

    private OpenAiApi openAiApi(String apiKey, String baseUrl) {
        return OpenAiApi.builder()
                .apiKey(apiKey)
                .baseUrl(baseUrl)
                .build();
    }
}
