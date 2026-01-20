package com.akatsuki.auth.common.security;

import com.akatsuki.auth.common.exception.AuthCommonInvalidAccessTokenException;
import com.akatsuki.auth.common.exception.AuthCommonSignatureMismatchException;
import com.akatsuki.auth.common.util.AsymmetricJwtUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.security.core.context.SecurityContextHolder;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.UUID;

import static org.mockito.Mockito.*;

class JwtAuthenticationFilterTest {

    @Mock
    AsymmetricJwtUtil jwtUtil;

    @Mock
    HttpServletRequest request;

    @Mock
    HttpServletResponse response;

    @Mock
    FilterChain filterChain;

    JwtAuthenticationFilter filter;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        filter = new JwtAuthenticationFilter(jwtUtil);
        SecurityContextHolder.clearContext();
    }

    @Test
    void doFilterInternal_ValidToken_SetsAuthentication() throws ServletException, IOException, AuthCommonInvalidAccessTokenException, AuthCommonSignatureMismatchException {
        String token = "validToken";
        UUID userId = UUID.randomUUID();

        when(request.getHeader("Authorization")).thenReturn("Bearer " + token);
        doNothing().when(jwtUtil).validateAccessToken(token);
        when(jwtUtil.getUserIdFromAccessToken(token)).thenReturn(userId);

        filter.doFilterInternal(request, response, filterChain);

        Assertions.assertNotNull(SecurityContextHolder.getContext().getAuthentication());
        Assertions.assertEquals(userId.toString(), SecurityContextHolder.getContext().getAuthentication().getPrincipal());
        verify(filterChain).doFilter(request, response);
    }

    @Test
    void doFilterInternal_NoToken_ShouldContinueChainWithoutSettingAuth() throws ServletException, IOException {
        // Scenario: Authorization header is missing
        when(request.getHeader("Authorization")).thenReturn(null);

        filter.doFilterInternal(request, response, filterChain);

        Assertions.assertNull(SecurityContextHolder.getContext().getAuthentication());
        // Verify it passed to the next filter (Passive Bypass)
        verify(filterChain).doFilter(request, response);
        verifyNoInteractions(jwtUtil);
    }

    @Test
    void doFilterInternal_InvalidHeaderFormat_ShouldContinueChainWithoutSettingAuth() throws ServletException, IOException {
        // Scenario: Header exists but is not "Bearer "
        when(request.getHeader("Authorization")).thenReturn("Basic QWxhZGRpbjpvcGVuIHNlc2FtZQ==");

        filter.doFilterInternal(request, response, filterChain);

        Assertions.assertNull(SecurityContextHolder.getContext().getAuthentication());
        verify(filterChain).doFilter(request, response);
        verifyNoInteractions(jwtUtil);
    }

    @Test
    void doFilterInternal_InvalidAccessTokenException_Returns401() throws ServletException, IOException, AuthCommonInvalidAccessTokenException {
        String token = "invalidToken";
        PrintWriter printWriter = mock(PrintWriter.class);

        when(request.getHeader("Authorization")).thenReturn("Bearer " + token);
        when(response.getWriter()).thenReturn(printWriter);

        doThrow(new AuthCommonInvalidAccessTokenException("Invalid")).when(jwtUtil).validateAccessToken(token);

        filter.doFilterInternal(request, response, filterChain);

        Assertions.assertNull(SecurityContextHolder.getContext().getAuthentication());
        verify(response).setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        // Ensure chain is STOPPED on bad tokens
        verify(filterChain, never()).doFilter(request, response);
    }

    @Test
    void doFilterInternal_GenericException_Returns401() throws ServletException, IOException, AuthCommonInvalidAccessTokenException {
        String token = "token";
        PrintWriter printWriter = mock(PrintWriter.class);

        when(request.getHeader("Authorization")).thenReturn("Bearer " + token);
        when(response.getWriter()).thenReturn(printWriter);

        // Unexpected error (e.g. database down during validation)
        doThrow(new RuntimeException("Server Error")).when(jwtUtil).validateAccessToken(token);

        filter.doFilterInternal(request, response, filterChain);

        verify(response).setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        verify(filterChain, never()).doFilter(request, response);
    }
}