package com.akatsuki.auth.common.util;

import com.akatsuki.auth.common.exception.AuthCommonInvalidAccessTokenException;
import com.akatsuki.auth.common.exception.AuthCommonInvalidRefreshTokenException;
import com.akatsuki.auth.common.exception.AuthCommonInvalidTokenException;
import com.akatsuki.auth.common.exception.AuthCommonSignatureMismatchException;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.SignatureException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import java.security.PublicKey;
import java.time.Instant;
import java.util.UUID;

@Component
public class AsymmetricJwtUtil {

    private static final Logger log = LoggerFactory.getLogger(AsymmetricJwtUtil.class);
    private final PublicKey publicKey;

    public AsymmetricJwtUtil(PublicKey publicKey){
        this.publicKey = publicKey;
    }

    public void validateAccessToken(String token) throws AuthCommonInvalidAccessTokenException {
        if(!isValidAccessToken(token)) {
            throw new AuthCommonInvalidAccessTokenException("Invalid access token");
        }
    }

    public void validateRefreshToken(String token) throws AuthCommonInvalidRefreshTokenException {
        if(!isValidRefreshToken(token)) {
            throw new AuthCommonInvalidRefreshTokenException("Invalid refresh token");
        }
    }

    public boolean isValidAccessToken(String token) {
        try{
            validateToken(token);
            Claims claims = getTokenClaims(token);
            return claims.get("token_type", String.class).equals("access");
        }
        catch (AuthCommonInvalidTokenException | AuthCommonSignatureMismatchException e)
        {
            return false;
        }
    }

    public boolean isValidRefreshToken(String token) {
        try{
            validateToken(token);
            Claims claims = getTokenClaims(token);
            return claims.get("token_type", String.class).equals("refresh");
        }
        catch (AuthCommonInvalidTokenException | AuthCommonSignatureMismatchException e)
        {
            return false;
        }
    }

    public Instant getIssuedAt(String token) throws AuthCommonSignatureMismatchException, AuthCommonInvalidTokenException {
        validateToken(token);
        Claims claims = getTokenClaims(token);

        return claims.getIssuedAt().toInstant();
    }

    public Instant getExpiration(String token) throws AuthCommonInvalidTokenException, AuthCommonSignatureMismatchException {
        validateToken(token);
        Claims claims = getTokenClaims(token);
        return claims.getExpiration().toInstant();
    }

    public UUID getUserIdFromAccessToken(String accessToken) throws AuthCommonInvalidAccessTokenException, AuthCommonSignatureMismatchException {
        validateAccessToken(accessToken);
        Claims claims = getTokenClaims(accessToken);
        String userIdStr = claims.getSubject();
        return UUID.fromString(userIdStr);
    }

    private Claims getTokenClaims(String token) throws AuthCommonSignatureMismatchException {
        try {
            return Jwts.parser()
                    .verifyWith(publicKey)
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();
        } catch (SignatureException e) {
            // This is the primary exception for signature mismatch
            log.warn("JWT signature validation failed: {}", e.getMessage(), e);
            throw new AuthCommonSignatureMismatchException(e.getMessage());
        }
    }

    private void validateToken(String token) throws AuthCommonInvalidTokenException {
        try{
            Jwts.parser().verifyWith(publicKey)
                    .build()
                    .parseSignedClaims(token);
        } catch(SignatureException e){
            throw new AuthCommonInvalidTokenException("Invalid JWT signature");
        } catch (JwtException e) {
            throw new AuthCommonInvalidTokenException("Invalid JWT");
        }
    }
}
