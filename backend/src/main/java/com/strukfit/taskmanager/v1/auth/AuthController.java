package com.strukfit.taskmanager.v1.auth;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.strukfit.taskmanager.common.dto.ApiResponse;
import com.strukfit.taskmanager.v1.auth.dto.AuthResponse;
import com.strukfit.taskmanager.v1.auth.dto.LoginDTO;
import com.strukfit.taskmanager.v1.auth.jwt.JwtService;
import com.strukfit.taskmanager.v1.auth.refreshtoken.RefreshToken;
import com.strukfit.taskmanager.v1.auth.refreshtoken.RefreshTokenService;
import com.strukfit.taskmanager.v1.auth.refreshtoken.dto.RefreshTokenDTO;
import com.strukfit.taskmanager.v1.user.User;
import com.strukfit.taskmanager.v1.user.UserMapper;
import com.strukfit.taskmanager.v1.user.UserService;
import com.strukfit.taskmanager.v1.user.dto.UserRegisterDTO;

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

    @PostMapping("/signup")
    public ResponseEntity<ApiResponse<AuthResponse>> signup(@Valid @RequestBody UserRegisterDTO dto) {
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
