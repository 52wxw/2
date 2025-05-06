package com.example.controller;

import com.example.dto.UserRegistrationDto;
import com.example.entity.Submission;
import com.example.entity.Task;
import com.example.entity.User;
import com.example.repository.TaskRepository;
import com.example.repository.UserRepository;
import com.example.service.SubmissionService;
import com.example.service.TaskService;
import com.example.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final UserService userService;
    private final TaskService taskService;
    private final SubmissionService submissionService;
    private final UserRepository userRepository;
    private final TaskRepository taskRepository;

    @Autowired
    public AdminController(UserService userService, TaskService taskService, SubmissionService submissionService,
                           UserRepository userRepository, TaskRepository taskRepository) {
        this.userService = userService;
        this.taskService = taskService;
        this.submissionService = submissionService;
        this.userRepository = userRepository;
        this.taskRepository = taskRepository;
    }

    // 获取用户列表
    @GetMapping("/alluser")
    public ResponseEntity<List<User>> getUsers() {
        List<User> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    // 创建新用户
    @PostMapping("/users")
    public ResponseEntity<User> createUser(@RequestBody User user) {
        try {
            // 检查用户名或邮箱是否已存在
            if (userRepository.existsByUsername(user.getUsername())) {
                return ResponseEntity.badRequest().body(null);
            }
            if (userRepository.existsByEmail(user.getEmail())) {
                return ResponseEntity.badRequest().body(null);
            }
            // 调用 UserService 创建用户
            User createdUser = userService.createUser(user);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdUser);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
     }

    // 创建新任务
    @PostMapping("/tasks")
    public ResponseEntity<Task> createTask(@RequestBody com.example.dto.TaskRequest taskRequest) {
        Task task = taskService.createTask(taskRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(task);
    }

    // 更新任务
    @PutMapping("/tasks/{taskId}")
    public ResponseEntity<Task> updateTask(@PathVariable Long taskId, @RequestBody com.example.dto.TaskRequest taskRequest) {
        Task task = taskService.updateTask(taskId, taskRequest);
        return ResponseEntity.ok(task);
    }

    // 删除任务
    @DeleteMapping("/tasks/{taskId}")
    public ResponseEntity<Void> deleteTask(@PathVariable Long taskId) {
        taskService.deleteTask(taskId);
        return ResponseEntity.noContent().build();
    }

    // 获取所有任务
    @GetMapping("/tasks")
    public ResponseEntity<List<Task>> getTasks() {
        List<Task> tasks = taskService.getAllTasks();
        return ResponseEntity.ok(tasks);
    }

    // 获取所有提交记录
    @GetMapping("/submissions")
    public ResponseEntity<List<Submission>> getSubmissions() {
        List<Submission> submissions = submissionService.getAllSubmissions();
        return ResponseEntity.ok(submissions);
    }

    // 获取用户总数
    @GetMapping("/users/count")
    public ResponseEntity<Long> getTotalUsers() {
        Long count = (long) userService.getAllUsers().size();
        return ResponseEntity.ok(count);
    }

    // 获取活跃用户数（假设 enabled 为 true 表示活跃用户）
    @GetMapping("/users/active/count")
    public ResponseEntity<Long> getActiveUsers() {
        List<User> users = userService.getAllUsers();
        long activeCount = users.stream().filter(User::getEnabled).count();
        return ResponseEntity.ok(activeCount);
    }

    // 获取任务总数
    @GetMapping("/tasks/count")
    public ResponseEntity<Long> getTotalTasks() {
        Long count = (long) taskService.getAllTasks().size();
        return ResponseEntity.ok(count);
    }
    @DeleteMapping("/users/{userId}")
    @PreAuthorize("hasRole('ADMIN')") // 确保只有管理员可以删除用户
    public ResponseEntity<?> deleteUser(@PathVariable Long userId) {
        try {
            // 调用服务层删除用户
            userService.deleteUser(userId);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            // 处理删除失败的情况
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("删除用户失败: " + e.getMessage());
        }
    }

    // 获取完成任务数（假设 passed 为 true 表示完成任务）
    @GetMapping("/tasks/completed/count")
    public ResponseEntity<Long> getCompletedTasks() {
        List<Submission> submissions = submissionService.getAllSubmissions();
        long completedCount = submissions.stream().filter(Submission::getPassed).count();
        return ResponseEntity.ok(completedCount);
    }
}
