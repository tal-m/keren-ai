package com.akatsuki.auth.common.security;

import com.akatsuki.auth.common.exception.AuthCommonInvalidAccessTokenException;
import com.akatsuki.auth.common.exception.AuthCommonSignatureMismatchException;
import com.akatsuki.auth.common.util.AsymmetricJwtUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;
import java.util.UUID;

public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final AsymmetricJwtUtil jwtUtil;

    public JwtAuthenticationFilter(AsymmetricJwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        String header = request.getHeader("Authorization");

        if (!StringUtils.hasText(header) || !header.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            logger.info("No Bearer token found in request to " + request.getRequestURI());
            return;
        }

        String token = header.substring(7);
        try {
            jwtUtil.validateAccessToken(token);

            if (SecurityContextHolder.getContext().getAuthentication() == null) {
                UUID userId = jwtUtil.getUserIdFromAccessToken(token);

                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(userId.toString(), null, Collections.emptyList());

                authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authentication);
            }

            filterChain.doFilter(request, response);

        } catch (AuthCommonInvalidAccessTokenException | AuthCommonSignatureMismatchException e) {
            logger.warn("JWT validation failed: " + e.getMessage());
            writeErrorResponse(response, "Your session has expired or the token is invalid. Please log in again.");
        } catch (Exception e) {
            logger.error("Unexpected authentication error", e);
            writeErrorResponse(response, "Authentication processing failed.");
        }
    }

    private void writeErrorResponse(HttpServletResponse response, String errorMessage) throws IOException {
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        String json = String.format(
                "{\"error\": \"%s\", \"message\": \"%s\"}",
                "UNAUTHORIZED",
                errorMessage
        );

        response.getWriter().write(json);
        response.getWriter().flush();
    }
}