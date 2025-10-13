package com.strukfit.taskmanager.v1.auth.refreshtoken;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.strukfit.taskmanager.v1.user.User;

public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {
    Optional<RefreshToken> findByToken(String token);

    void deleteByUser(User user);
}
