package com.strukfit.taskmanager.v1.issue.dto;

import com.strukfit.taskmanager.v1.issue.enums.Priority;
import com.strukfit.taskmanager.v1.issue.enums.Status;
import com.strukfit.taskmanager.v1.validation.common.NotEmptyString;

import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class IssueUpdateDTO {
    @Size(max = 60)
    @NotEmptyString()
    private String title;

    @Size(max = 2000)
    private String description;

    private Priority priority;
    private Status status;
    private Long projectId;
}
