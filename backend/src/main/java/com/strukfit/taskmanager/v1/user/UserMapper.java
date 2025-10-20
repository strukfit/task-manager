package com.strukfit.taskmanager.v1.user;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

import com.strukfit.taskmanager.v1.user.dto.UserDTO;
import com.strukfit.taskmanager.v1.user.dto.UserRegisterDTO;
import com.strukfit.taskmanager.v1.user.dto.UserResponse;
import com.strukfit.taskmanager.v1.user.dto.UserUpdateDTO;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING, nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface UserMapper {
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "authorities", ignore = true)
    @Mapping(target = "passwordHash", ignore = true)
    void createUserFromDTO(UserRegisterDTO dto, @MappingTarget User user);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "authorities", ignore = true)
    @Mapping(target = "passwordHash", ignore = true)
    void updateUserFromDTO(UserUpdateDTO dto, @MappingTarget User user);

    UserDTO toDTO(User user);

    UserResponse toResponse(User user);
}
