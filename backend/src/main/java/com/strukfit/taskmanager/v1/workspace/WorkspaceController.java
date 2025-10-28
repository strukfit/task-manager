package com.strukfit.taskmanager.v1.workspace;

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
import com.strukfit.taskmanager.v1.user.User;
import com.strukfit.taskmanager.v1.utils.SecurityUtils;
import com.strukfit.taskmanager.v1.workspace.dto.WorkspaceCreateDTO;
import com.strukfit.taskmanager.v1.workspace.dto.WorkspaceDTO;
import com.strukfit.taskmanager.v1.workspace.dto.WorkspaceUpdateDTO;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/workspaces")
public class WorkspaceController {
    @Autowired
    private WorkspaceService workspaceService;

    @Autowired
    private WorkspaceMapper workspaceMapper;

    @Autowired
    private SecurityUtils securityUtils;

    @GetMapping
    public ResponseEntity<ApiResponse<List<WorkspaceDTO>>> getAll() {
        User user = securityUtils.getCurrentUser();
        List<WorkspaceDTO> workspaces = workspaceService.getAllForUser(user)
                .stream()
                .map(workspaceMapper::toDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(ApiResponse.success(workspaces));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<WorkspaceDTO>> getById(@PathVariable Long id) {
        User user = securityUtils.getCurrentUser();
        Workspace entity = workspaceService.getById(id, user);
        WorkspaceDTO workspace = workspaceMapper.toDTO(entity);
        return ResponseEntity.ok(ApiResponse.success(workspace));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<WorkspaceDTO>> create(@Valid @RequestBody WorkspaceCreateDTO dto) {
        User user = securityUtils.getCurrentUser();
        Workspace entity = workspaceService.create(dto, user);
        WorkspaceDTO workspace = workspaceMapper.toDTO(entity);
        return ResponseEntity.status(201).body(ApiResponse.success(workspace));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<WorkspaceDTO>> update(@PathVariable Long id,
            @Valid @RequestBody WorkspaceUpdateDTO dto) {
        User user = securityUtils.getCurrentUser();
        Workspace updatedEntity = workspaceService.update(id, dto, user);
        WorkspaceDTO updated = workspaceMapper.toDTO(updatedEntity);
        return ResponseEntity.ok(ApiResponse.success(updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        User user = securityUtils.getCurrentUser();
        workspaceService.delete(id, user);
        return ResponseEntity.status(204).body(ApiResponse.success(null, "Workspace deleted"));
    }
}
