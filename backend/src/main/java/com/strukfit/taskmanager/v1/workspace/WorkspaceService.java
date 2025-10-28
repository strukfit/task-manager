package com.strukfit.taskmanager.v1.workspace;

import java.util.List;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.strukfit.taskmanager.v1.user.User;
import com.strukfit.taskmanager.v1.workspace.dto.WorkspaceCreateDTO;
import com.strukfit.taskmanager.v1.workspace.dto.WorkspaceUpdateDTO;

@Service
public class WorkspaceService {
    @Autowired
    private WorkspaceRepository workspaceRepository;

    @Autowired
    private WorkspaceMapper workspaceMapper;

    public List<Workspace> getAllForUser(User user) {
        Sort sort = Sort.by(Sort.Direction.DESC, "createdAt");
        return workspaceRepository.findByUser(user, sort);
    }

    public Workspace getById(Long id, User user) {
        Workspace workspace = workspaceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Workspace not found"));
        if (!workspace.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized");
        }
        return workspace;
    }

    public Workspace create(WorkspaceCreateDTO dto, User user) {
        Workspace workspace = new Workspace();
        BeanUtils.copyProperties(dto, workspace);
        workspace.setUser(user);
        return workspaceRepository.save(workspace);
    }

    public Workspace update(Long id, WorkspaceUpdateDTO dto, User user) {
        Workspace workspace = getById(id, user);
        workspaceMapper.updateWorkspaceFromDTO(dto, workspace);
        return workspaceRepository.save(workspace);
    }

    public void delete(Long id, User user) {
        Workspace workspace = getById(id, user);
        workspaceRepository.delete(workspace);
    }
}
