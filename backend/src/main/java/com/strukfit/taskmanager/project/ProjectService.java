package com.strukfit.taskmanager.project;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.strukfit.taskmanager.project.dto.ProjectCreateDTO;
import com.strukfit.taskmanager.project.dto.ProjectUpdateDTO;
import com.strukfit.taskmanager.user.User;
import com.strukfit.taskmanager.workspace.Workspace;
import com.strukfit.taskmanager.workspace.WorkspaceRepository;

@Service
public class ProjectService {
    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private ProjectMapper projectMapper;

    @Autowired
    private WorkspaceRepository workspaceRepository;

    private Workspace getWorkspaceById(Long id, User user) {
        Workspace workspace = workspaceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Workspace not found"));
        if (!workspace.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized");
        }
        return workspace;
    }

    public List<Project> getByWorkspace(Long wokspaceId, User user) {
        Workspace workspace = getWorkspaceById(wokspaceId, user);
        return projectRepository.findByWorkspace(workspace);
    }

    public Project create(Long wokspaceId, ProjectCreateDTO dto, User user) {
        Workspace workspace = getWorkspaceById(wokspaceId, user);
        Project project = new Project();
        projectMapper.createProjectFromDTO(dto, project);
        project.setWorkspace(workspace);
        return projectRepository.save(project);
    }

    public Project update(Long workspaceId, Long projectId, ProjectUpdateDTO dto, User user) {
        getWorkspaceById(workspaceId, user);
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found"));
        if (!project.getWorkspace().getId().equals(workspaceId)) {
            throw new RuntimeException("Project does not belong to workspace");
        }
        projectMapper.updateProjectFromDTO(dto, project);
        return projectRepository.save(project);
    }

    public void delete(Long workspaceId, Long projectId, User user) {
        getWorkspaceById(workspaceId, user);
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found"));
        if (!project.getWorkspace().getId().equals(workspaceId)) {
            throw new RuntimeException("Project does not belong to workspace");
        }
        projectRepository.delete(project);
    }
}
