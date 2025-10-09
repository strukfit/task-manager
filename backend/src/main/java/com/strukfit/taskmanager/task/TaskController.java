package com.strukfit.taskmanager.task;

import java.util.List;

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
import com.strukfit.taskmanager.task.dto.TaskCreateDTO;
import com.strukfit.taskmanager.task.dto.TaskResponseDTO;
import com.strukfit.taskmanager.task.dto.TaskUpdateDTO;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/v1/tasks")
public class TaskController {
    @Autowired
    private TaskService taskService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<TaskResponseDTO>>> getAllTasks() {
        List<TaskResponseDTO> tasks = taskService.getAllTasks();
        return ResponseEntity.ok(ApiResponse.success(tasks));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<TaskResponseDTO>> getTaskById(@PathVariable Long id) {
        return taskService.getTaskById(id)
                .map(task -> ResponseEntity.ok(ApiResponse.success(task)))
                .orElse(ResponseEntity.status(404).body(ApiResponse.error("Task not found")));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<TaskResponseDTO>> createTask(@Valid @RequestBody TaskCreateDTO dto) {
        TaskResponseDTO createdTask = taskService.createTask(dto);
        return ResponseEntity.ok(ApiResponse.success(createdTask));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<TaskResponseDTO>> updateTask(@PathVariable Long id,
            @Valid @RequestBody TaskUpdateDTO dto) {
        try {
            TaskResponseDTO updatedTask = taskService.updateTask(id, dto);
            return ResponseEntity.ok(ApiResponse.success(updatedTask));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteTask(@PathVariable Long id) {
        try {
            taskService.deleteTask(id);
            return ResponseEntity.ok(ApiResponse.success(null));
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(ApiResponse.error("Task not found"));
        }
    }
}
