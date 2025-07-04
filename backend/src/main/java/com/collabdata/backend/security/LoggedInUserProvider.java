package com.collabdata.backend.security;

import com.collabdata.backend.exception.UserNotFoundException;
import com.collabdata.backend.model.User;
import com.collabdata.backend.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
public class LoggedInUserProvider {

    private static final Logger logger = LoggerFactory.getLogger(LoggedInUserProvider.class);
    private final UserRepository userRepository;

    public LoggedInUserProvider(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User getCurrentUser() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        if (principal instanceof String username) {
            logger.info("🔐 Fetching logged-in user: {}", username);
            return userRepository.findByUsername(username)
                    .orElseThrow(() -> new UserNotFoundException("username: " + username));
        }

        throw new RuntimeException("Invalid authentication principal");
    }

    // DEV ONLY: Simulate login for now
    public void mockLogin(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException(userId.toString()));

        var auth = new org.springframework.security.authentication.UsernamePasswordAuthenticationToken(
                user.getUsername(), null, java.util.Collections.emptyList()
        );

        SecurityContextHolder.getContext().setAuthentication(auth);
        logger.info("✅ Mock login as user: {} ({})", user.getUsername(), user.getId());
    }
}
