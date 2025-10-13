package com.strukfit.taskmanager.v1.workspace;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.strukfit.taskmanager.v1.user.User;

public interface WorkspaceRepository extends JpaRepository<Workspace, Long> {
    List<Workspace> findByUser(User user);
}
