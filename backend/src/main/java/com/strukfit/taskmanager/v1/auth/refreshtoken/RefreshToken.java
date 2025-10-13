package com.strukfit.taskmanager.v1.auth.refreshtoken;

import java.time.LocalDateTime;

import com.strukfit.taskmanager.v1.user.User;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class RefreshToken {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String token;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private LocalDateTime expiryDate;
}
