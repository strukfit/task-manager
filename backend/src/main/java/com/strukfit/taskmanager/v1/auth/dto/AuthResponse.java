package com.strukfit.taskmanager.v1.auth.dto;

import com.strukfit.taskmanager.v1.user.dto.UserResponse;

import lombok.Data;

@Data
public class AuthResponse {
    private String accessToken;
    private String refreshToken;
    private UserResponse user;

    public AuthResponse(String accessToken, String refreshToken, UserResponse user) {
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
        this.user = user;
    }
}
