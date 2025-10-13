package com.strukfit.taskmanager.v1.issue;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.strukfit.taskmanager.v1.project.Project;
import com.strukfit.taskmanager.v1.workspace.Workspace;

public interface IssueRepository extends JpaRepository<Issue, Long> {
    List<Issue> findByWorkspace(Workspace workspace);

    List<Issue> findByWorkspaceAndProject(Workspace workspace, Project project);
}
