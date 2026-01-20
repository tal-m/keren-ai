package com.akatsuki.auth.common.service;

import java.util.UUID;

import io.jsonwebtoken.Jwts;

import java.security.PrivateKey;
import java.util.Date;


public final class TestTokenGenerator {

    public static final int ACCESS_TOKEN_LIFE_SPAN = 1000 * 60 * 3;
    public static final int REFRESH_TOKEN_LIFE_SPAN = 1000 * 60 * 15;


    public static String generateAccessToken(UUID userId, PrivateKey privateKey) {
        return generateToken(userId, "access", ACCESS_TOKEN_LIFE_SPAN, privateKey);
    }

    public static String generateRefreshToken(UUID userId, PrivateKey privateKey) {
        return generateToken(userId, "refresh", REFRESH_TOKEN_LIFE_SPAN, privateKey);
    }

    private static String generateToken(UUID userId, String tokenType, long expirationMillis, PrivateKey privateKey) {
        return Jwts.builder()
                .subject(userId.toString())
                .claim("token_type", tokenType)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + expirationMillis))
                .signWith(privateKey)
                .compact();
    }
}
