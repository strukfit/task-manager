package com.strukfit.taskmanager.v1.issue;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import com.strukfit.taskmanager.v1.project.Project;
import com.strukfit.taskmanager.v1.workspace.Workspace;

public interface IssueRepository extends JpaRepository<Issue, Long>, JpaSpecificationExecutor<Issue> {
    List<Issue> findByWorkspace(Workspace workspace);

    List<Issue> findByWorkspaceAndProject(Workspace workspace, Project project);
}
