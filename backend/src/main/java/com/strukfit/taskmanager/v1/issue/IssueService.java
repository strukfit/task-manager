package com.strukfit.taskmanager.v1.issue;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.strukfit.taskmanager.v1.issue.dto.IssueCreateDTO;
import com.strukfit.taskmanager.v1.issue.dto.IssueDTO;
import com.strukfit.taskmanager.v1.issue.dto.IssueUpdateDTO;
import com.strukfit.taskmanager.v1.issue.enums.Status;
import com.strukfit.taskmanager.v1.project.Project;
import com.strukfit.taskmanager.v1.project.ProjectRepository;
import com.strukfit.taskmanager.v1.user.User;
import com.strukfit.taskmanager.v1.workspace.Workspace;
import com.strukfit.taskmanager.v1.workspace.WorkspaceRepository;

@Service
public class IssueService {
    @Autowired
    private IssueRepository issueRepository;

    @Autowired
    private IssueMapper issueMapper;

    @Autowired
    private WorkspaceRepository workspaceRepository;

    @Autowired
    private ProjectRepository projectRepository;

    private Workspace getWorkspaceById(Long id, User user) {
        Workspace workspace = workspaceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Workspace not found"));
        if (!workspace.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized");
        }
        return workspace;
    }

    private Project getProjectById(Long workspaceId, Long projectId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found"));
        if (!project.getWorkspace().getId().equals(workspaceId)) {
            throw new RuntimeException("Project does not belong to workspace");
        }
        return project;
    }

    private Issue getIssueById(Long workspaceId, Long id, User user) {
        Issue issue = issueRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Issue not found"));
        if (!issue.getWorkspace().getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized");
        }
        if (!issue.getWorkspace().getId().equals(workspaceId)) {
            throw new RuntimeException("Issue does not belong to workspace");
        }
        return issue;
    }

    private void updateIssueProject(Issue issue, Long projectId) {
        if (projectId == null) {
            return;
        }
        if (projectId == -1) {
            issue.setProject(null);
            return;
        }
        Project project = getProjectById(issue.getWorkspace().getId(), projectId);
        issue.setProject(project);
    }

    public Map<Status, List<IssueDTO>> getByWorkspaceGroupedByStatus(Long workspaceId, User user, Long projectId) {
        Workspace workspace = getWorkspaceById(workspaceId, user);
        List<Issue> issues = projectId != null
                ? issueRepository.findByWorkspaceAndProject(workspace, projectRepository.findById(projectId)
                        .orElseThrow(() -> new RuntimeException("Project not found")))
                : issueRepository.findByWorkspace(workspace);
        return issues.stream()
                .collect(Collectors.groupingBy(Issue::getStatus,
                        Collectors.mapping(issueMapper::toDTO, Collectors.toList())));
    }

    public Issue getById(Long workspaceId, Long id, User user) {
        return getIssueById(workspaceId, id, user);
    }

    public Issue create(Long workspaceId, IssueCreateDTO dto, User user) {
        Workspace workspace = getWorkspaceById(workspaceId, user);
        Issue issue = new Issue();
        issueMapper.createIssueFromDTO(dto, issue);
        issue.setWorkspace(workspace);
        updateIssueProject(issue, dto.getProjectId());
        return issueRepository.save(issue);
    }

    public Issue update(Long workspaceId, Long id, IssueUpdateDTO dto, User user) {
        Issue issue = getIssueById(workspaceId, id, user);
        issueMapper.updateIssueFromDTO(dto, issue);
        updateIssueProject(issue, dto.getProjectId());
        return issueRepository.save(issue);
    }

    public void delete(Long workspaceId, Long id, User user) {
        Issue issue = getIssueById(workspaceId, id, user);
        issueRepository.delete(issue);
    }
}
