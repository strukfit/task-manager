package com.strukfit.taskmanager.v1.issue;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.strukfit.taskmanager.common.dto.ApiResponse;
import com.strukfit.taskmanager.v1.issue.dto.IssueCreateDTO;
import com.strukfit.taskmanager.v1.issue.dto.IssueDTO;
import com.strukfit.taskmanager.v1.issue.dto.IssueQueryDTO;
import com.strukfit.taskmanager.v1.issue.dto.IssueUpdateDTO;
import com.strukfit.taskmanager.v1.user.User;
import com.strukfit.taskmanager.v1.utils.SecurityUtils;

import jakarta.validation.Valid;

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
    public ResponseEntity<ApiResponse<Map<String, List<IssueDTO>>>> getGroupedByStatus(
            @PathVariable Long workspaceId,
            @Valid @ModelAttribute IssueQueryDTO dto) {
        User user = securityUtils.getCurrentUser();
        Map<String, List<IssueDTO>> issues = issueService.getByWorkspace(workspaceId, user, dto);
        return ResponseEntity.ok(ApiResponse.success(issues));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<IssueDTO>> getById(@PathVariable Long workspaceId, @PathVariable Long id) {
        User user = securityUtils.getCurrentUser();
        Issue entity = issueService.getById(workspaceId, id, user);
        IssueDTO issue = issueMapper.toDTO(entity);
        return ResponseEntity.ok(ApiResponse.success(issue));
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
    public ResponseEntity<ApiResponse<IssueDTO>> update(@PathVariable Long workspaceId, @PathVariable Long id,
            @Valid @RequestBody IssueUpdateDTO dto) {
        User user = securityUtils.getCurrentUser();
        Issue entity = issueService.update(workspaceId, id, dto, user);
        IssueDTO issue = issueMapper.toDTO(entity);
        return ResponseEntity.ok(ApiResponse.success(issue));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long workspaceId, @PathVariable Long id) {
        User user = securityUtils.getCurrentUser();
        issueService.delete(workspaceId, id, user);
        return ResponseEntity.status(204).body(ApiResponse.success(null, "Issue deleted"));
    }
}
