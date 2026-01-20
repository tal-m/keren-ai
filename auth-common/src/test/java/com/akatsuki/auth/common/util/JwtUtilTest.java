package com.akatsuki.auth.common.util;

import com.akatsuki.auth.common.configuration.UnitTestConfiguration;
import com.akatsuki.auth.common.exception.AuthCommonInvalidAccessTokenException;
import com.akatsuki.auth.common.exception.AuthCommonInvalidRefreshTokenException;
import com.akatsuki.auth.common.exception.AuthCommonInvalidTokenException;
import com.akatsuki.auth.common.exception.AuthCommonSignatureMismatchException;
import com.akatsuki.auth.common.service.TestTokenGenerator;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.security.*;
import java.time.Instant;
import java.util.Base64;
import java.util.Date;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
@Import(UnitTestConfiguration.class)
@SpringBootTest
class JwtUtilTest {

    private AsymmetricJwtUtil jwtUtil;
    private PrivateKey privateKey;
    private PublicKey publicKey;
    private final UUID userId = UUID.randomUUID();

    @Autowired
    private KeyPair testKeyPair;

    @BeforeEach
    void setUp() {
        privateKey = testKeyPair.getPrivate();
        publicKey = testKeyPair.getPublic();

        jwtUtil = new AsymmetricJwtUtil(publicKey);
    }

    @Test
    void generateAndValidateAccessToken() throws AuthCommonInvalidAccessTokenException {
        String token = TestTokenGenerator.generateAccessToken(userId, privateKey);
        assertNotNull(token);
        assertTrue(jwtUtil.isValidAccessToken(token));
        jwtUtil.validateAccessToken(token);
    }

    @Test
    void generateAndValidateRefreshToken() throws AuthCommonInvalidRefreshTokenException {
        String token = TestTokenGenerator.generateRefreshToken(userId, privateKey);
        assertNotNull(token);
        assertTrue(jwtUtil.isValidRefreshToken(token));
        jwtUtil.validateRefreshToken(token);
    }

    @Test
    void isValidAccessToken_WithRefreshToken_ReturnsFalse() {
        String refreshToken = TestTokenGenerator.generateRefreshToken(userId, privateKey);
        assertFalse(jwtUtil.isValidAccessToken(refreshToken));
    }

    @Test
    void isValidRefreshToken_WithAccessToken_ReturnsFalse() {
        String accessToken = TestTokenGenerator.generateAccessToken(userId, privateKey);
        assertFalse(jwtUtil.isValidRefreshToken(accessToken));
    }

    @Test
    void getIssuedAtAndExpiration() throws AuthCommonSignatureMismatchException, AuthCommonInvalidTokenException {
        String refreshToken = TestTokenGenerator.generateRefreshToken(userId, privateKey);
        Instant issuedAt = jwtUtil.getIssuedAt(refreshToken);
        Instant expiration = jwtUtil.getExpiration(refreshToken);
        assertNotNull(issuedAt);
        assertNotNull(expiration);
        assertTrue(expiration.isAfter(issuedAt));
    }

    @Test
    void getUserIdFromAccessToken_ReturnsCorrectUserId() throws AuthCommonInvalidAccessTokenException, AuthCommonSignatureMismatchException {
        String accessToken = TestTokenGenerator.generateAccessToken(userId, privateKey);
        UUID extracted = jwtUtil.getUserIdFromAccessToken(accessToken);
        assertEquals(userId, extracted);
    }

    @Test
    void validateAccessToken_InvalidToken_ThrowsException() {
        String invalidToken = TestTokenGenerator.generateRefreshToken(userId, privateKey);
        assertThrows(AuthCommonInvalidAccessTokenException.class, () -> jwtUtil.validateAccessToken(invalidToken));
    }

    @Test
    void validateRefreshToken_InvalidToken_ThrowsException() {
        String invalidToken = TestTokenGenerator.generateAccessToken(userId, privateKey);
        assertThrows(AuthCommonInvalidRefreshTokenException.class, () -> jwtUtil.validateRefreshToken(invalidToken));
    }

    @Test
    void validateToken_InvalidSignature_ThrowsJwtException() {
        // Generate a token with a different secret (invalid signature)
        String otherSecret = Base64.getEncoder().encodeToString("another-very-strong-secret-key-123!".getBytes());
        byte[] keyBytes = Base64.getDecoder().decode(otherSecret.getBytes(StandardCharsets.UTF_8));
        SecretKey otherKey = Keys.hmacShaKeyFor(keyBytes);

        String invalidSignatureToken = Jwts.builder()
                .subject(userId.toString())
                .claim("token_type", "access")
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + 1000 * 60 * 1))
                .signWith(otherKey)
                .compact();

        assertThrows(AuthCommonInvalidAccessTokenException.class, () -> jwtUtil.validateAccessToken(invalidSignatureToken));
    }

    @Test
    void validateToken_MalformedToken_ThrowsJwtException() {
        String malformedToken = "this.is.not.a.jwt";
        assertThrows(AuthCommonInvalidAccessTokenException.class, () -> jwtUtil.validateAccessToken(malformedToken));
    }


}