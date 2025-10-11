package com.strukfit.taskmanager.issue.dto;

import com.strukfit.taskmanager.issue.enums.Priority;
import com.strukfit.taskmanager.issue.enums.Status;
import com.strukfit.taskmanager.project.dto.ProjectDTO;

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
