package com.akatsuki.auth.config;

import com.akatsuki.auth.model.User;
import com.akatsuki.auth.enums.AuthProvider;
import com.akatsuki.auth.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class AdminUserInitializer implements ApplicationRunner {

    private final UserService userService;
    private final PasswordEncoder passwordEncoder;

    // Use SpEL to default to null if the property is missing
    @Value("${admin.email}")
    private String adminEmail;

    @Value("${admin.password}")
    private String adminPassword;

    @Override
    public void run(ApplicationArguments args) {
        // 1. Check if the client provided BOTH email and password
        if (isMissing(adminEmail) || isMissing(adminPassword)) {
            log.warn("*************************************************************");
            log.warn("WARNING: No initial admin credentials provided via Environment.");
            log.warn("The system will start with NO default user.");
            log.warn("To fix: Set APP_ADMIN_EMAIL and APP_ADMIN_PASSWORD.");
            log.warn("*************************************************************");
            return;
        }

        // 2. Only attempt to create if this specific email doesn't exist yet
        if (userService.findByEmail(adminEmail).isEmpty()) {
            try {
                User admin = new User(
                        adminEmail,
                        passwordEncoder.encode(adminPassword),
                        AuthProvider.LOCAL
                );

                userService.save(admin);
                log.info(">>> Successfully created initial user: {}", adminEmail);

            } catch (Exception e) {
                // This will catch the @Email validation failure from your Entity
                log.error("FAILED TO CREATE ADMIN: The provided email '{}' is invalid according to entity constraints.", adminEmail);
            }
        }
        else {
            log.info("There a user with user name:  {}", adminEmail);
        }
    }

    private boolean isMissing(String value) {
        return value == null || value.isBlank();
    }
}