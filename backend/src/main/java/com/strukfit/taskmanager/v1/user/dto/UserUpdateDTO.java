package com.strukfit.taskmanager.v1.user.dto;

import com.strukfit.taskmanager.v1.validation.common.NotEmptyString;

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
}
