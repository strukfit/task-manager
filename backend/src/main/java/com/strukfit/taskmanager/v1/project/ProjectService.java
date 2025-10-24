package com.strukfit.taskmanager.v1.project;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.strukfit.taskmanager.v1.project.dto.ProjectCreateDTO;
import com.strukfit.taskmanager.v1.project.dto.ProjectQueryDTO;
import com.strukfit.taskmanager.v1.project.dto.ProjectUpdateDTO;
import com.strukfit.taskmanager.v1.user.User;
import com.strukfit.taskmanager.v1.workspace.Workspace;
import com.strukfit.taskmanager.v1.workspace.WorkspaceRepository;

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

    private Project getProjectById(Long workspaceId, Long projectId, User user) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found"));
        if (!project.getWorkspace().getId().equals(workspaceId)) {
            throw new RuntimeException("Project does not belong to workspace");
        }
        Workspace workspace = project.getWorkspace();
        if (!workspace.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized");
        }
        return project;
    }

    public Page<Project> getAllByWorkspace(Long wokspaceId, User user, ProjectQueryDTO dto) {
        Workspace workspace = getWorkspaceById(wokspaceId, user);

        Pageable pageable = dto.toPageable();

        return projectRepository.findByWorkspace(workspace, pageable);
    }

    public Project getById(Long workspaceId, Long projectId, User user) {
        return getProjectById(workspaceId, projectId, user);
    }

    public Project create(Long wokspaceId, ProjectCreateDTO dto, User user) {
        Workspace workspace = getWorkspaceById(wokspaceId, user);
        Project project = new Project();
        projectMapper.createProjectFromDTO(dto, project);
        project.setWorkspace(workspace);
        return projectRepository.save(project);
    }

    public Project update(Long workspaceId, Long projectId, ProjectUpdateDTO dto, User user) {
        Project project = getProjectById(workspaceId, projectId, user);
        projectMapper.updateProjectFromDTO(dto, project);
        return projectRepository.save(project);
    }

    public void delete(Long workspaceId, Long projectId, User user) {
        Project project = getProjectById(workspaceId, projectId, user);
        projectRepository.delete(project);
    }
}
