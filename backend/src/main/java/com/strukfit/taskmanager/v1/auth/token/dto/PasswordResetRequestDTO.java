package com.strukfit.taskmanager.v1.auth.token.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class PasswordResetRequestDTO {
    @NotBlank()
    @Email()
    private String email;
}
