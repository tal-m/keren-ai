package com.akatsuki.auth.common.config;

import com.akatsuki.auth.common.security.JwtAuthenticationFilter;
import com.akatsuki.auth.common.security.SecurityProperties;
import com.akatsuki.auth.common.util.AsymmetricJwtUtil;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class FilterConfig {

    @Bean
    public JwtAuthenticationFilter jwtAuthenticationFilter(AsymmetricJwtUtil asymmetricJwtUtil, SecurityProperties securityProperties) {
        return new JwtAuthenticationFilter(asymmetricJwtUtil, securityProperties.getPermitAllRoutes());
    }
}
