package com.strukfit.taskmanager.v1.user;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.strukfit.taskmanager.v1.user.dto.UserRegisterDTO;
import com.strukfit.taskmanager.v1.user.dto.UserUpdateDTO;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserMapper userMapper;

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public User register(UserRegisterDTO dto) {
        User user = new User();
        userMapper.createUserFromDTO(dto, user);
        user.setPasswordHash(passwordEncoder.encode(dto.getPassword()));
        return userRepository.save(user);
    }

    public User update(Long userId, UserUpdateDTO dto) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));

        if (dto.getUsername() != null && !user.getUsername().equals(dto.getUsername())) {
            User existingUser = userRepository.findByUsername(dto.getUsername());
            if (existingUser != null) {
                throw new RuntimeException("User with this username already exists");
            }
        }

        if (dto.getEmail() != null && !user.getEmail().equals(dto.getEmail())) {
            var existingUser = userRepository.findByEmail(dto.getEmail());
            if (existingUser.isPresent()) {
                throw new RuntimeException("User with this email already exists");
            }
        }

        userMapper.updateUserFromDTO(dto, user);
        return userRepository.save(user);
    }

    public User updatePassword(Long userId, String newPassword) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        user.setPasswordHash(passwordEncoder.encode(newPassword));
        return userRepository.save(user);
    }

    public User updatePassword(Long userId, String currentPassword, String newPassword) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
            throw new RuntimeException("Current password is incorrect");
        }
        user.setPasswordHash(passwordEncoder.encode(newPassword));
        return userRepository.save(user);
    }

    public User findById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public User findByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    public User findByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User with this email address not found"));
    }
}
