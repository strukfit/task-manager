package com.strukfit.taskmanager.v1.project;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.strukfit.taskmanager.v1.workspace.Workspace;

public interface ProjectRepository extends JpaRepository<Project, Long> {
    Page<Project> findByWorkspace(Workspace workspace, Pageable pageable);
}
