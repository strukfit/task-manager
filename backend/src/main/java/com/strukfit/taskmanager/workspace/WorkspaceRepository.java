package com.strukfit.taskmanager.workspace;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.strukfit.taskmanager.user.User;

public interface WorkspaceRepository extends JpaRepository<Workspace, Long> {
    List<Workspace> findByUser(User user);
}
