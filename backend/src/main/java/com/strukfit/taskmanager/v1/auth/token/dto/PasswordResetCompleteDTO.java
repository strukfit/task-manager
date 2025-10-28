package com.strukfit.taskmanager.v1.auth.token.dto;

import com.strukfit.taskmanager.v1.validation.user.ValidPassword;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class PasswordResetCompleteDTO {
    @NotBlank()
    private String token;

    @NotBlank(message = "Password is mandatory")
    @ValidPassword(message = "Password must be 8-128 characters long, contain at least one uppercase letter, one lowercase letter, one digit and no whitespace")
    private String password;
}
