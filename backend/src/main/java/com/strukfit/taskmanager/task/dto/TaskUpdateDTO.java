package com.strukfit.taskmanager.task.dto;

import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class TaskUpdateDTO {
    @Size(min = 2, max = 100, message = "Title must be between 2 and 100 characters")
    private String title;

    @Size(max = 500, message = "Description cannot be longer than 500 characters")
    private String description;

    private boolean completed;
}
