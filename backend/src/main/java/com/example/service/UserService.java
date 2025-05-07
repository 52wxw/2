package com.example.service;

import com.example.dto.UserRegistrationDto;
import com.example.entity.User;
import java.util.List; // 添加这一行
import java.util.Optional;

public interface UserService {
    User save(UserRegistrationDto registrationDto);
    List<User> getAllUsers();
    Optional<User> getUserById(Long id);
    User updateUser(Long id, User userDetails);
    Optional<User> getUserByUsername(String username);
    void deleteUser(Long id);
    User createUser(User user);
    // 添加 saveUser 方法
    User saveUser(UserRegistrationDto registrationDto); 
}
