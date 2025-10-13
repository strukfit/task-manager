package com.strukfit.taskmanager.v1.issue.dto;

import com.strukfit.taskmanager.v1.issue.enums.Priority;
import com.strukfit.taskmanager.v1.issue.enums.Status;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class IssueCreateDTO {
    @NotBlank()
    @Size(max = 60)
    private String title;

    @Size(max = 255)
    private String description;

    private Priority priority;
    private Status status;
    private Long projectId;
}
