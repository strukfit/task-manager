package com.strukfit.taskmanager.project;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

import com.strukfit.taskmanager.project.dto.ProjectCreateDTO;
import com.strukfit.taskmanager.project.dto.ProjectDTO;
import com.strukfit.taskmanager.project.dto.ProjectUpdateDTO;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING, nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface ProjectMapper {
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "workspace", ignore = true)
    void createProjectFromDTO(ProjectCreateDTO dto, @MappingTarget Project project);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "workspace", ignore = true)
    void updateProjectFromDTO(ProjectUpdateDTO dto, @MappingTarget Project project);

    ProjectDTO toDTO(Project project);
}
