package com.akatsuki.keren_ai.exception.handler;

import com.akatsuki.keren_ai.exception.KerenAiException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class KerenAiExceptionHandler {
    @ExceptionHandler(KerenAiException.class)
    public ResponseEntity<String> handleKerenAiException(KerenAiException ex) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ex.getMessage());
    }
}
