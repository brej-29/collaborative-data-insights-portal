package com.collabdata.backend.repository;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

import jakarta.annotation.PostConstruct;

@Component
public class PasswordPrinter {
    @PostConstruct
    public void print() {
        String rawPassword = "test123";
        String hashed = new BCryptPasswordEncoder().encode(rawPassword);
        System.out.println("BCrypt hash for '" + rawPassword + "': " + hashed);
    }
}