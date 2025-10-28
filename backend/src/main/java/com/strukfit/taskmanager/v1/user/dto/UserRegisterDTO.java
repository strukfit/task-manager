package com.strukfit.taskmanager.v1.user.dto;

import com.strukfit.taskmanager.v1.validation.common.NotEmptyString;
import com.strukfit.taskmanager.v1.validation.user.ValidPassword;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UserRegisterDTO {
    @NotBlank(message = "Username is mandatory")
    @NotNull()
    @NotEmptyString()
    @Size(max = 60, message = "Username cannot be longer than 60 characters")
    private String username;

    @NotBlank(message = "Email is mandatory")
    @Email
    private String email;

    @NotBlank(message = "Password is mandatory")
    @ValidPassword(message = "Password must be 8-128 characters long, contain at least one uppercase letter, one lowercase letter, one digit and no whitespace")
    private String password;
}
