package com.strukfit.taskmanager.v1.project;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
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
import com.strukfit.taskmanager.v1.project.dto.ProjectCreateDTO;
import com.strukfit.taskmanager.v1.project.dto.ProjectDTO;
import com.strukfit.taskmanager.v1.project.dto.ProjectQueryDTO;
import com.strukfit.taskmanager.v1.project.dto.ProjectUpdateDTO;
import com.strukfit.taskmanager.v1.user.User;
import com.strukfit.taskmanager.v1.utils.SecurityUtils;

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
    public ResponseEntity<ApiResponse<Page<ProjectDTO>>> getAll(
            @PathVariable Long workspaceId,
            @Valid @ModelAttribute ProjectQueryDTO dto) {
        User user = securityUtils.getCurrentUser();
        Page<ProjectDTO> projects = projectService.getAllByWorkspace(workspaceId, user, dto).map(projectMapper::toDTO);
        return ResponseEntity.ok(ApiResponse.success(projects));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ProjectDTO>> getById(@PathVariable Long workspaceId, @PathVariable Long id) {
        User user = securityUtils.getCurrentUser();
        Project entity = projectService.getById(workspaceId, id, user);
        ProjectDTO project = projectMapper.toDTO(entity);
        return ResponseEntity.ok(ApiResponse.success(project));
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
