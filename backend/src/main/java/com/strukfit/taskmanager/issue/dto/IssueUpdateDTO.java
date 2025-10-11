package com.strukfit.taskmanager.issue.dto;

import com.strukfit.taskmanager.issue.enums.Priority;
import com.strukfit.taskmanager.issue.enums.Status;

import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class IssueUpdateDTO {
    @Size(max = 60)
    private String title;

    @Size(max = 255)
    private String description;

    private Priority priority;
    private Status status;
    private Long projectId;
}
