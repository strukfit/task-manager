package com.strukfit.taskmanager.v1.user.dto;

import com.strukfit.taskmanager.v1.validation.user.ValidPassword;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class UserPasswordDTO {
    @NotBlank(message = "Current password is mandatory")
    private String currentPassword;

    @NotBlank(message = "New password is mandatory")
    @ValidPassword(message = "Password must be 8-128 characters long, contain at least one uppercase letter, one lowercase letter, one digit and no whitespace")
    private String newPassword;
}
