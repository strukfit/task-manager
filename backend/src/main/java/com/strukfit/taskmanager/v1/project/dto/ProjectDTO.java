package com.strukfit.taskmanager.v1.project.dto;

import lombok.Data;

@Data
public class ProjectDTO {
    private Long id;
    private String name;
    private String description;
    private String createdAt;
}
