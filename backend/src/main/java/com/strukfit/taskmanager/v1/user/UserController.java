package com.strukfit.taskmanager.v1.user;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.strukfit.taskmanager.common.dto.ApiResponse;
import com.strukfit.taskmanager.v1.user.dto.UserDTO;
import com.strukfit.taskmanager.v1.user.dto.UserPasswordDTO;
import com.strukfit.taskmanager.v1.user.dto.UserUpdateDTO;
import com.strukfit.taskmanager.v1.utils.SecurityUtils;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/users")
public class UserController {
    @Autowired
    private UserService userService;

    @Autowired
    private UserMapper userMapper;

    @Autowired
    private SecurityUtils securityUtils;

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserDTO>> getCurrentUser() {
        User user = securityUtils.getCurrentUser();
        UserDTO dto = userMapper.toDTO(user);
        return ResponseEntity.ok(ApiResponse.success(dto));
    }

    @PutMapping("/me")
    public ResponseEntity<ApiResponse<UserDTO>> updateProfile(
            @Valid @RequestBody UserUpdateDTO dto) {
        User currentUser = securityUtils.getCurrentUser();
        User updated = userService.update(currentUser.getId(), dto);
        UserDTO response = userMapper.toDTO(updated);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PutMapping("/me/password")
    public ResponseEntity<ApiResponse<Void>> updatePassword(
            @Valid @RequestBody UserPasswordDTO dto) {
        User currentUser = securityUtils.getCurrentUser();
        userService.updatePassword(currentUser.getId(), dto.getCurrentPassword(), dto.getNewPassword());
        return ResponseEntity.ok(ApiResponse.success(null, "Password updated successfully"));
    }
}
