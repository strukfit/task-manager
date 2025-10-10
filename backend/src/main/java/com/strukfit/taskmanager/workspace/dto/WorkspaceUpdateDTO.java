package com.strukfit.taskmanager.workspace.dto;

import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class WorkspaceUpdateDTO {

    @Size(max = 60)
    private String name;

    @Size(max = 255)
    private String description;
}
