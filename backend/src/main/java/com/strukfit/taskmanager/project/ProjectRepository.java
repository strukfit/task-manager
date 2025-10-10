package com.strukfit.taskmanager.project;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.strukfit.taskmanager.workspace.Workspace;

public interface ProjectRepository extends JpaRepository<Project, Long> {
    List<Project> findByWorkspace(Workspace workspace);
}
