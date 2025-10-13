package com.strukfit.taskmanager.v1.project;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.strukfit.taskmanager.v1.workspace.Workspace;

public interface ProjectRepository extends JpaRepository<Project, Long> {
    List<Project> findByWorkspace(Workspace workspace);
}
