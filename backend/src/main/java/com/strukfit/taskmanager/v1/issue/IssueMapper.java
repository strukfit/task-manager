package com.strukfit.taskmanager.v1.issue;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

import com.strukfit.taskmanager.v1.issue.dto.IssueCreateDTO;
import com.strukfit.taskmanager.v1.issue.dto.IssueDTO;
import com.strukfit.taskmanager.v1.issue.dto.IssueUpdateDTO;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING, nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface IssueMapper {
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "workspace", ignore = true)
    @Mapping(target = "project", ignore = true)
    void createIssueFromDTO(IssueCreateDTO dto, @MappingTarget Issue issue);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "workspace", ignore = true)
    @Mapping(target = "project", ignore = true)
    void updateIssueFromDTO(IssueUpdateDTO dto, @MappingTarget Issue issue);

    IssueDTO toDTO(Issue issue);
}
