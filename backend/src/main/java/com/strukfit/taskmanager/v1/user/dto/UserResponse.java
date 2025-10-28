package com.strukfit.taskmanager.v1.user.dto;

import lombok.Data;

@Data
public class UserResponse {
    private Long id;
    private String username;
    private String email;
}
