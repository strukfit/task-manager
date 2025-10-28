package com.strukfit.taskmanager.v1.auth.token;

import java.time.LocalDateTime;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import com.strukfit.taskmanager.v1.auth.token.enums.TokenType;
import com.strukfit.taskmanager.v1.user.User;

@Service
public class TokenService {
    @Autowired
    private TokenRepository tokenRepository;

    @Value("${jwt.refresh-token-ttl}")
    private long refreshTokenTtl;

    @Value("${app.password-reset-token-ttl}")
    private long passwordResetTokenTtl;

    private Token createToken(User user, TokenType type, LocalDateTime expiryDate) {
        Token token = new Token();
        token.setToken(UUID.randomUUID().toString());
        token.setType(type);
        token.setUser(user);
        token.setExpiryDate(expiryDate);
        return tokenRepository.save(token);
    }

    private Token verifyToken(String token, TokenType type) {
        Token foundToken = tokenRepository.findByTokenAndType(token, type)
                .orElseThrow(() -> new IllegalArgumentException("Invalid " + type.name().toLowerCase() + " token"));

        if (foundToken.getExpiryDate().isBefore(LocalDateTime.now())) {
            tokenRepository.delete(foundToken);
            throw new IllegalArgumentException(type.name().toLowerCase() + " token has expired");
        }

        return foundToken;
    }

    public Token createRefreshToken(User user) {
        return createToken(user, TokenType.REFRESH, LocalDateTime.now().plusSeconds(refreshTokenTtl));
    }

    public Token createPasswordResetToken(User user) {
        return createToken(user, TokenType.PASSWORD_RESET, LocalDateTime.now().plusSeconds(passwordResetTokenTtl));
    }

    public Token verifyRefreshToken(String token) {
        return verifyToken(token, TokenType.REFRESH);
    }

    public Token verifyPasswordResetToken(String token) {
        return verifyToken(token, TokenType.PASSWORD_RESET);
    }

    public void deleteToken(Token token) {
        tokenRepository.delete(token);
    }

    @Scheduled(cron = "0 0 0 * * ?") // Daily at midnight
    public void cleanUpExpiredTokens() {
        tokenRepository.deleteByExpiryDateBefore(LocalDateTime.now());
    }
}
