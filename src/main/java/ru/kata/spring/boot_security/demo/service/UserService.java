package ru.kata.spring.boot_security.demo.service;

import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.validation.annotation.Validated;
import ru.kata.spring.boot_security.demo.model.User;

import java.util.List;

@Validated
public interface UserService extends UserDetailsService {
    User add (User user);
    User update (User user);

    void delete(Long id);

    List<User> listUsers();

    User findUserById(Long id);

    User findByUsername(String username);
}
