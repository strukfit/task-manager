package com.strukfit.taskmanager.v1.workspace.dto;

import com.strukfit.taskmanager.v1.validation.common.NotEmptyString;

import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class WorkspaceUpdateDTO {

    @Size(max = 60)
    @NotEmptyString()
    private String name;

    @Size(max = 255)
    private String description;
}
