package com.strukfit.taskmanager.v1.project.dto;

import com.strukfit.taskmanager.v1.validation.common.NotEmptyString;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class ProjectCreateDTO {
    @NotBlank()
    @NotNull()
    @NotEmptyString()
    @Size(max = 60)
    private String name;

    @Size(max = 255)
    private String description;
}
