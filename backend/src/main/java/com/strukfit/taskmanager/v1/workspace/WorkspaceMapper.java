package com.strukfit.taskmanager.v1.workspace;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

import com.strukfit.taskmanager.v1.workspace.dto.WorkspaceDTO;
import com.strukfit.taskmanager.v1.workspace.dto.WorkspaceUpdateDTO;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING, nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface WorkspaceMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "projects", ignore = true)
    @Mapping(target = "issues", ignore = true)
    void updateWorkspaceFromDTO(WorkspaceUpdateDTO dto, @MappingTarget Workspace workspace);

    WorkspaceDTO toDTO(Workspace workspace);
}
