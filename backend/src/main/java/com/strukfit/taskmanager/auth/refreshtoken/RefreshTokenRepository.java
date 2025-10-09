package com.strukfit.taskmanager.auth.refreshtoken;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.strukfit.taskmanager.user.User;

public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {
    Optional<RefreshToken> findByToken(String token);

    void deleteByUser(User user);
}
