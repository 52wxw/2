package com.example.service;

import com.example.dto.UserRegistrationDto;
import com.example.entity.User;

public interface UserService {
    User save(UserRegistrationDto registrationDto);
    List<User> getAllUsers();
    Optional<User> getUserById(Long id);
    User updateUser(Long id, User userDetails);
    Optional<User> getUserByUsername(String username);
    void deleteUser(Long id);
    // 添加 saveUser 方法
    User saveUser(UserRegistrationDto registrationDto); 
}
