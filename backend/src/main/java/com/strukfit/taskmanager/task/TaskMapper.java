package com.strukfit.taskmanager.task;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import com.strukfit.taskmanager.task.dto.TaskCreateDTO;
import com.strukfit.taskmanager.task.dto.TaskResponseDTO;
import com.strukfit.taskmanager.task.dto.TaskUpdateDTO;

@Mapper(componentModel = "spring")
public interface TaskMapper {
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "completed", constant = "false")
    Task toEntity(TaskCreateDTO dto);

    @Mapping(target = "id", ignore = true)
    Task toEntity(TaskUpdateDTO dto, @MappingTarget Task task);

    TaskResponseDTO toResponseDTO(Task task);
}
