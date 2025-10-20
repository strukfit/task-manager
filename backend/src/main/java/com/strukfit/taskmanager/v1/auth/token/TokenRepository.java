package com.strukfit.taskmanager.v1.auth.token;

import java.time.LocalDateTime;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.strukfit.taskmanager.v1.auth.token.enums.TokenType;

public interface TokenRepository extends JpaRepository<Token, Long> {
    Optional<Token> findByTokenAndType(String token, TokenType type);

    void deleteByExpiryDateBefore(LocalDateTime expiryDate);
}
