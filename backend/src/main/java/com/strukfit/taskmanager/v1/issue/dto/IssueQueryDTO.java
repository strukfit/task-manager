package com.strukfit.taskmanager.v1.issue.dto;

import java.util.List;

import com.strukfit.taskmanager.v1.issue.enums.Status;

import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class IssueQueryDTO {
    private List<Long> projectIds;
    private List<Status> statuses;
    private List<String> priorities;

    @Pattern(regexp = "title|status|priority|createdAt")
    private String sortBy = "createdAt";

    @Pattern(regexp = "asc|desc")
    private String sortOrder = "desc";

    @Pattern(regexp = "status|priority|project|none")
    private String groupBy = "status";
}
