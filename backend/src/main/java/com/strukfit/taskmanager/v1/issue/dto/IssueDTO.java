package com.strukfit.taskmanager.v1.issue.dto;

import com.strukfit.taskmanager.v1.issue.enums.Priority;
import com.strukfit.taskmanager.v1.issue.enums.Status;
import com.strukfit.taskmanager.v1.project.dto.ProjectDTO;

import lombok.Data;

@Data
public class IssueDTO {
    private Long id;
    private String title;
    private String description;
    private Priority priority;
    private Status status;
    private ProjectDTO project;
}
