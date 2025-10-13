package com.strukfit.taskmanager.v1.user;

import org.mapstruct.Mapper;
import org.mapstruct.MappingConstants;

import com.strukfit.taskmanager.v1.user.dto.UserDTO;
import com.strukfit.taskmanager.v1.user.dto.UserResponse;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING)
public interface UserMapper {
    UserDTO toDTO(User user);

    UserResponse toResponse(User user);
}
