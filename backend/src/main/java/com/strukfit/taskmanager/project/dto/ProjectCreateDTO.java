package com.strukfit.taskmanager.project.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class ProjectCreateDTO {
    @NotBlank()
    @Size(max = 60)
    private String name;

    @Size(max = 255)
    private String description;
}
