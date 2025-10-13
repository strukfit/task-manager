package com.strukfit.taskmanager.v1.workspace.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class WorkspaceCreateDTO {

    @NotBlank()
    @Size(max = 60)
    private String name;

    @Size(max = 255)
    private String description;
}
