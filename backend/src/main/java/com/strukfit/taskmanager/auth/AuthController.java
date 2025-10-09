package com.strukfit.taskmanager.auth;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.strukfit.taskmanager.auth.dto.AuthResponse;
import com.strukfit.taskmanager.auth.dto.LoginDTO;
import com.strukfit.taskmanager.auth.jwt.JwtService;
import com.strukfit.taskmanager.auth.refreshtoken.RefreshToken;
import com.strukfit.taskmanager.auth.refreshtoken.RefreshTokenService;
import com.strukfit.taskmanager.auth.refreshtoken.dto.RefreshTokenDTO;
import com.strukfit.taskmanager.common.dto.ApiResponse;
import com.strukfit.taskmanager.user.User;
import com.strukfit.taskmanager.user.UserMapper;
import com.strukfit.taskmanager.user.UserService;
import com.strukfit.taskmanager.user.dto.UserRegisterDTO;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/auth")
public class AuthController {
    @Autowired
    private UserService userService;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private RefreshTokenService refreshTokenService;

    @Autowired
    private UserMapper userMapper;

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<AuthResponse>> register(@Valid @RequestBody UserRegisterDTO dto) {
        User user = userService.register(dto);
        String accessToken = jwtService.generateAccessToken(user);
        RefreshToken refreshToken = refreshTokenService.createRefreshToken(user);
        AuthResponse authResponse = new AuthResponse(accessToken, refreshToken.getToken(), userMapper.toResponse(user));
        return ResponseEntity.status(201).body(ApiResponse.success(authResponse));
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody LoginDTO dto) {
        User user = userService.findByUsername(dto.getUsername());
        if (user != null && passwordEncoder.matches(dto.getPassword(), user.getPassword())) {
            String accessToken = jwtService.generateAccessToken(user);
            RefreshToken refreshToken = refreshTokenService.createRefreshToken(user);
            AuthResponse authResponse = new AuthResponse(
                    accessToken,
                    refreshToken.getToken(),
                    userMapper.toResponse(user));
            return ResponseEntity.ok(ApiResponse.success(authResponse));
        }
        return ResponseEntity.status(401).body(ApiResponse.error("Invalid credentials"));
    }

    @PostMapping("/refresh")
    public ResponseEntity<ApiResponse<AuthResponse>> refreshToken(@Valid @RequestBody RefreshTokenDTO dto) {
        RefreshToken refreshToken = refreshTokenService.verifyRefreshToken(dto.getRefreshToken());
        User user = refreshToken.getUser();
        String newAccesToken = jwtService.generateAccessToken(user);
        AuthResponse authResponse = new AuthResponse(
                newAccesToken,
                refreshToken.getToken(),
                userMapper.toResponse(user));
        return ResponseEntity.ok(ApiResponse.success(authResponse));
    }
}
