package com.strukfit.taskmanager.v1.project.dto;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class ProjectQueryDTO {
    @Pattern(regexp = "name|createdAt")
    private String sortBy = "createdAt";

    @Pattern(regexp = "asc|desc")
    private String sortOrder = "desc";

    private Integer page;
    private Integer size;

    public Pageable toPageable() {
        Sort sort = Sort.by(
                "asc".equalsIgnoreCase(sortOrder) ? Sort.Direction.ASC : Sort.Direction.DESC,
                sortBy);

        if (page == null || size == null) {
            return Pageable.unpaged(sort);
        }

        return PageRequest.of(page, size, sort);
    }
}
