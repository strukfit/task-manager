package com.strukfit.taskmanager.project;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.strukfit.taskmanager.common.dto.ApiResponse;
import com.strukfit.taskmanager.project.dto.ProjectCreateDTO;
import com.strukfit.taskmanager.project.dto.ProjectDTO;
import com.strukfit.taskmanager.project.dto.ProjectUpdateDTO;
import com.strukfit.taskmanager.user.User;
import com.strukfit.taskmanager.utils.SecurityUtils;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/workspaces/{workspaceId}/projects")
public class ProjectController {
    @Autowired
    private ProjectService projectService;

    @Autowired
    private ProjectMapper projectMapper;

    @Autowired
    private SecurityUtils securityUtils;

    @GetMapping
    public ResponseEntity<ApiResponse<List<ProjectDTO>>> getAll(@PathVariable Long workspaceId) {
        User user = securityUtils.getCurrentUser();
        List<ProjectDTO> projects = projectService.getByWorkspace(workspaceId, user)
                .stream()
                .map(projectMapper::toDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(ApiResponse.success(projects));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<ProjectDTO>> create(@PathVariable Long workspaceId,
            @Valid @RequestBody ProjectCreateDTO dto) {
        User user = securityUtils.getCurrentUser();
        Project entity = projectService.create(workspaceId, dto, user);
        ProjectDTO project = projectMapper.toDTO(entity);
        return ResponseEntity.status(201).body(ApiResponse.success(project));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<ProjectDTO>> update(
            @PathVariable Long workspaceId,
            @PathVariable Long id,
            @Valid @RequestBody ProjectUpdateDTO dto) {
        User user = securityUtils.getCurrentUser();
        Project entity = projectService.update(workspaceId, id, dto, user);
        ProjectDTO project = projectMapper.toDTO(entity);
        return ResponseEntity.ok(ApiResponse.success(project));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long workspaceId, @PathVariable Long id) {
        User user = securityUtils.getCurrentUser();
        projectService.delete(workspaceId, id, user);
        return ResponseEntity.status(204).body(ApiResponse.success(null, "Project deleted"));
    }
}
