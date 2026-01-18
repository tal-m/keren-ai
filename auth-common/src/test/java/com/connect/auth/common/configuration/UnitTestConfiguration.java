package com.akatsuki.auth.common.configuration;

import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import java.security.KeyPair;
import java.security.KeyPairGenerator;
import java.security.PublicKey;

@TestConfiguration
public class UnitTestConfiguration {

    @Bean
    public KeyPair getkeyPair() throws Exception {
        KeyPairGenerator generator = KeyPairGenerator.getInstance("RSA");
        generator.initialize(2048);
        return generator.generateKeyPair();
    }

    @Bean
    public PublicKey publicKey(KeyPair keyPair) {
        return keyPair.getPublic();
    }
}
