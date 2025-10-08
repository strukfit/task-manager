package com.strukfit.taskmanager.task;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.strukfit.taskmanager.task.dto.TaskCreateDTO;
import com.strukfit.taskmanager.task.dto.TaskResponseDTO;
import com.strukfit.taskmanager.task.dto.TaskUpdateDTO;

@Service
public class TaskService {
    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private TaskMapper taskMapper;

    public List<TaskResponseDTO> getAllTasks() {
        return taskRepository.findAll().stream()
            .map(taskMapper::toResponseDTO)
            .collect(Collectors.toList());
    }

    public Optional<TaskResponseDTO> getTaskById(Long id) {
        return taskRepository.findById(id)
            .map(taskMapper::toResponseDTO);
    }

    public TaskResponseDTO createTask(TaskCreateDTO dto) {
        Task task = taskMapper.toEntity(dto);
        Task savedTask = taskRepository.save(task);
        return taskMapper.toResponseDTO(savedTask);
    }

    public TaskResponseDTO updateTask(Long id, TaskUpdateDTO dto) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found"));
        taskMapper.toEntity(dto, task);
        Task updatedTask = taskRepository.save(task);
        return taskMapper.toResponseDTO(updatedTask);
    }

    public void deleteTask(Long id) {
        taskRepository.deleteById(id);
    }
}
