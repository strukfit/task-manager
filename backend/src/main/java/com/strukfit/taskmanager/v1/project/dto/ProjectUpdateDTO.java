package com.strukfit.taskmanager.v1.project.dto;

import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class ProjectUpdateDTO {
    @Size(max = 60)
    private String name;

    @Size(max = 255)
    private String description;
}
