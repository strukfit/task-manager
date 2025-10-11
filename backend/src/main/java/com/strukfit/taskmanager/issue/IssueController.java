package com.strukfit.taskmanager.issue;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.strukfit.taskmanager.common.dto.ApiResponse;
import com.strukfit.taskmanager.issue.dto.IssueCreateDTO;
import com.strukfit.taskmanager.issue.dto.IssueDTO;
import com.strukfit.taskmanager.issue.dto.IssueUpdateDTO;
import com.strukfit.taskmanager.issue.enums.Status;
import com.strukfit.taskmanager.user.User;
import com.strukfit.taskmanager.utils.SecurityUtils;

@RestController
@RequestMapping("/workspaces/{workspaceId}/issues")
public class IssueController {
    @Autowired
    private IssueService issueService;

    @Autowired
    private IssueMapper issueMapper;

    @Autowired
    private SecurityUtils securityUtils;

    @GetMapping
    public ResponseEntity<ApiResponse<Map<Status, List<IssueDTO>>>> getGroupedByStatus(
            @PathVariable Long workspaceId,
            @RequestParam(required = false) Long projectId) {
        User user = securityUtils.getCurrentUser();
        Map<Status, List<IssueDTO>> issues = issueService.getByWorkspaceGroupedByStatus(workspaceId, user, projectId);
        return ResponseEntity.ok(ApiResponse.success(issues));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<IssueDTO>> create(@PathVariable Long workspaceId,
            @RequestBody IssueCreateDTO dto) {
        User user = securityUtils.getCurrentUser();
        Issue entity = issueService.create(workspaceId, dto, user);
        IssueDTO issue = issueMapper.toDTO(entity);
        return ResponseEntity.status(201).body(ApiResponse.success(issue));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<IssueDTO>> update(@PathVariable Long id, @RequestBody IssueUpdateDTO dto) {
        User user = securityUtils.getCurrentUser();
        Issue entity = issueService.update(id, dto, user);
        IssueDTO issue = issueMapper.toDTO(entity);
        return ResponseEntity.ok(ApiResponse.success(issue));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        User user = securityUtils.getCurrentUser();
        issueService.delete(id, user);
        return ResponseEntity.status(204).body(ApiResponse.success(null, "Issue deleted"));
    }
}
