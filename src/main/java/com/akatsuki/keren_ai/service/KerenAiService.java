package com.akatsuki.keren_ai.service;

import com.akatsuki.keren_ai.domain.Chunk;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.client.ChatClientResponse;
import org.springframework.ai.document.Document;
import org.springframework.ai.vectorstore.SearchRequest;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

import static com.akatsuki.keren_ai.constant.kerenAiConstants.SYSTEM_PROMPT;
import static com.akatsuki.keren_ai.constant.kerenAiConstants.USER_PROMPT_TEMPLATE;

@Slf4j
@Service
public class KerenAiService {
    private final ChatClient chatClient;
    private final VectorStore vectorStore;

    public KerenAiService(@Qualifier("groqChatClient") ChatClient chatClient,
                          VectorStore vectorStore) {
        this.chatClient = chatClient;
        this.vectorStore = vectorStore;
    }

    public String userInput(String userInput) {
        String context = getContextFromSimilarDocuments(userInput);

        return chatClient.prompt()
                .system(SYSTEM_PROMPT)
                .user(u -> u.text(USER_PROMPT_TEMPLATE)
                        .param("context", context)
                        .param("user_input", userInput))
                .call().content();
    }

    public List<Document> addChunks(List<Chunk> chunks) {
        log.info("Adding {} chunks to vector store.", chunks.size());

        List<Document> documents = chunks.stream()
                .map(this::createDocument)
                .collect(Collectors.toList());

        vectorStore.add(documents);
        log.info("Chunks added to vector store.");
        return documents;
    }

    public Document addChunk(Chunk chunk) {
        log.info("Adding chunk with tag: {}", chunk.tag());
        log.info("Chunk content: {}", chunk.content());

        Document document = createDocument(chunk);
        vectorStore.add(List.of(document));
        log.info("Chunk added to vector store.");
        return document;
    }

    public List<Document> getChunks() {
        log.info("Fetching all chunks from vector store.");

        return vectorStore.similaritySearch(
                org.springframework.ai.vectorstore.SearchRequest.builder()
                        .query("") // Empty query to fetch all, adjust as needed
                        .topK(1000) // Arbitrary large number to fetch many documents
                        .similarityThreshold(0.0)
                        .build()
        );
    }

    private Document createDocument(Chunk chunk) {
        return Document.builder()
                .text(chunk.content())
                .metadata("tag", chunk.tag())
                .build();
    }

    private String getContextFromSimilarDocuments(String query) {
        List<Document> similarDocuments = searchSimilarDocuments(query);
        if (similarDocuments.isEmpty()) {
            return "לא נמצא מידע רלוונטי במאגר.";
        }
        return similarDocuments.stream()
                .map(Document::getText)
                .collect(Collectors.joining("\n\n"));
    }

    private List<Document> searchSimilarDocuments(String query) {
        SearchRequest searchRequest = searchRequest(query);
        return vectorStore.similaritySearch(searchRequest);
    }

    private SearchRequest searchRequest(String query) {
        return SearchRequest.builder()
                .query(query)
                .topK(7)
                .build();
    }

        public List<Document> getSimilarEmbeddings(String query) {
        log.info("Fetching similar embeddings for query: {}", query);
        SearchRequest searchRequest = searchRequest(query);
        return vectorStore.similaritySearch(searchRequest);
    }

    public Document deleteChunk(String id) {
        log.info("Deleting chunk with id: {}", id);
        SearchRequest searchRequest = SearchRequest.builder()
                .query("")
                .filterExpression("id == '" + id + "'")
                .topK(1)
                .build();

        Document document = vectorStore.similaritySearch(searchRequest).stream().findFirst().orElse(null);
        vectorStore.delete(List.of(id));
        log.info("Chunk deleted.");
        return document;
    }
}
