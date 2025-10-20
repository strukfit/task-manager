package com.strukfit.taskmanager.v1.user.dto;

import com.strukfit.taskmanager.v1.validation.common.NotEmptyString;
import com.strukfit.taskmanager.v1.validation.user.ValidPassword;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UserUpdateDTO {
    @NotEmptyString()
    @Size(max = 60, message = "Username cannot be longer than 60 characters")
    private String username;

    @Email
    private String email;

    @ValidPassword(message = "Password must be 8-128 characters long, contain at least one uppercase letter, one lowercase letter, one digit and no whitespace")
    private String password;
}
