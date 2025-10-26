package com.strukfit.taskmanager.v1.issue;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import com.strukfit.taskmanager.v1.issue.dto.IssueCreateDTO;
import com.strukfit.taskmanager.v1.issue.dto.IssueDTO;
import com.strukfit.taskmanager.v1.issue.dto.IssueQueryDTO;
import com.strukfit.taskmanager.v1.issue.dto.IssueUpdateDTO;
import com.strukfit.taskmanager.v1.issue.enums.Priority;
import com.strukfit.taskmanager.v1.issue.enums.Status;
import com.strukfit.taskmanager.v1.project.Project;
import com.strukfit.taskmanager.v1.project.ProjectRepository;
import com.strukfit.taskmanager.v1.user.User;
import com.strukfit.taskmanager.v1.utils.CriteriaUtils;
import com.strukfit.taskmanager.v1.workspace.Workspace;
import com.strukfit.taskmanager.v1.workspace.WorkspaceRepository;

import jakarta.persistence.criteria.Expression;
import jakarta.persistence.criteria.Order;
import jakarta.persistence.criteria.Predicate;

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

    private Specification<Issue> buildSpecification(Workspace workspace,
            List<Long> projectIds,
            List<Status> statuses,
            List<String> priorities,
            String sortBy,
            String sortOrder) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            predicates.add(cb.equal(root.get("workspace"), workspace));

            if (projectIds != null && !projectIds.isEmpty()) {
                List<Predicate> projectPredicates = new ArrayList<>();
                if (projectIds.contains(-1L)) {
                    projectPredicates.add(cb.isNull(root.get("project")));
                }
                if (projectIds.stream().anyMatch(id -> id != -1)) {
                    projectPredicates
                            .add(root.get("project").get("id").in(projectIds.stream().filter(id -> id != -1).toList()));
                }
                predicates.add(cb.or(projectPredicates.toArray(new Predicate[0])));
            }

            if (statuses != null && !statuses.isEmpty()) {
                predicates.add(root.get("status").in(statuses));
            }

            if (priorities != null && !priorities.isEmpty()) {
                predicates.add(root.get("priority").in(priorities));
            }

            if (query != null && sortBy != null && !sortBy.isEmpty()) {
                Expression<?> sortField = switch (sortBy.toLowerCase()) {
                    case "priority" -> CriteriaUtils.mapEnumToOrdinal(root, "priority", Priority.class, cb);
                    case "status" -> CriteriaUtils.mapEnumToOrdinal(root, "status", Status.class, cb);
                    case "title" -> root.get("title");
                    case "createdat" -> root.get("createdAt");
                    default -> root.get("createdAt");
                };
                Order order = "asc".equalsIgnoreCase(sortOrder) ? cb.asc(sortField) : cb.desc(sortField);
                query.orderBy(order);
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }

    public Map<String, List<IssueDTO>> getByWorkspace(Long workspaceId, User user, IssueQueryDTO dto) {
        Workspace workspace = getWorkspaceById(workspaceId, user);

        List<Long> projectIds = dto.getProjectIds();
        List<Status> statuses = dto.getStatuses();
        List<String> priorities = dto.getPriorities();
        String sortBy = dto.getSortBy();
        String sortOrder = dto.getSortOrder();
        String groupBy = dto.getGroupBy();

        Specification<Issue> spec = buildSpecification(workspace, projectIds, statuses, priorities, sortBy, sortOrder);
        List<Issue> issues = issueRepository.findAll(spec);

        String groupByLowerCase = groupBy.toLowerCase();

        if ("status".equals(groupByLowerCase)) {
            return issues.stream()
                    .collect(Collectors.groupingBy(
                            issue -> issue.getStatus().name(),
                            Collectors.mapping(issueMapper::toDTO, Collectors.toList())));
        }

        if ("priority".equals(groupByLowerCase)) {
            return issues.stream()
                    .collect(Collectors.groupingBy(
                            issue -> issue.getPriority().name(),
                            Collectors.mapping(issueMapper::toDTO, Collectors.toList())));

        }

        if ("project".equals(groupByLowerCase)) {
            return issues.stream()
                    .collect(Collectors.groupingBy(
                            issue -> issue.getProject() != null ? String.valueOf(issue.getProject().getName()) : "None",
                            Collectors.mapping(issueMapper::toDTO, Collectors.toList())));
        }

        return Map.of("all", issues.stream().map(issueMapper::toDTO).collect(Collectors.toList()));
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
