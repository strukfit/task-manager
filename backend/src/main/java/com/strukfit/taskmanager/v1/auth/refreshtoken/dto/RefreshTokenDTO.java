package com.strukfit.taskmanager.v1.auth.refreshtoken.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class RefreshTokenDTO {
    @NotBlank(message = "Refresh token is mandatory")
    private String refreshToken;
}
