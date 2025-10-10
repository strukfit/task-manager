package com.strukfit.taskmanager.utils;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import com.strukfit.taskmanager.user.User;

@Component
public class SecurityUtils {
    public User getCurrentUser() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (principal instanceof User) {
            return (User) principal;
        }
        throw new RuntimeException("No authenticated user found or invalid principal");
    }
}
