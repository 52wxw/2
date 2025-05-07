package com.example.service.impl;

import com.example.entity.Task;
import com.example.dto.TaskRequest;
import com.example.repository.TaskRepository;
import com.example.service.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TaskServiceImpl implements TaskService {

    private final TaskRepository taskRepository;

    @Autowired
    public TaskServiceImpl(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    @Override
    public Task createTask(TaskRequest taskRequest) {
        Task task = new Task();
        task.setTitle(taskRequest.getTitle());
        task.setDescription(taskRequest.getDescription());
        task.setCategory(taskRequest.getCategory());
        task.setPoints(taskRequest.getPoints());
        task.setAnswer(taskRequest.getAnswer());
        return taskRepository.save(task);
    }

    @Override
    public Task updateTask(Long id, TaskRequest taskRequest) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found with id: " + id));
        task.setTitle(taskRequest.getTitle());
        task.setDescription(taskRequest.getDescription());
        task.setCategory(taskRequest.getCategory());
        task.setPoints(taskRequest.getPoints());
        task.setAnswer(taskRequest.getAnswer());
        return taskRepository.save(task);
    }

    @Override
    public void deleteTask(Long id) {
        taskRepository.deleteById(id);
    }

    @Override
    public List<Task> getAllTasks() {
        return taskRepository.findAll();
    }

    @Override
    public Optional<Task> getTaskById(Long id) {
        return taskRepository.findById(id);
    }

    @Override
    public List<Task> getTasksByCategory(String category) {
        return taskRepository.findByCategory(category);
    }

    // 彻底删除 getTasksByLevel 方法（不再需要）
    // 原注释的方法已移除，无需保留
}
