package ru.kata.spring.boot_security.demo;

import org.springframework.stereotype.Component;
import ru.kata.spring.boot_security.demo.model.Role;
import ru.kata.spring.boot_security.demo.model.User;
import ru.kata.spring.boot_security.demo.repository.RoleRepository;
import ru.kata.spring.boot_security.demo.service.UserService;

import javax.annotation.PostConstruct;
import java.util.HashSet;
import java.util.Set;

@Component
public class InitUsersAndRoles {

    private final UserService userService;
    private final RoleRepository roleRepository;

    public InitUsersAndRoles(UserService userService, RoleRepository roleRepository) {
        this.userService = userService;
        this.roleRepository = roleRepository;
    }

    @PostConstruct
    public void createUsers() {
        Role admin = new Role("ROLE_ADMIN");
        Role user = new Role("ROLE_USER");

        roleRepository.save(admin);
        roleRepository.save(user);

        User user1 = new User("admin@mail.ru", "2enota3eja");
        User user2 = new User("user@mail.ru", "38gjgeuftd");

        Set<Role> set1 = new HashSet<>();
        Set<Role> set2 = new HashSet<>();
        set1.add(admin);
        set1.add(user);
        set2.add(user);

        user1.setRoles(set1);
        user2.setRoles(set2);

        user1.setName("admin");
        user1.setLastName("admin");
        user1.setAge(35);

        user2.setName("user");
        user2.setLastName("user");
        user2.setAge(30);

        userService.add(user1);
        userService.add(user2);

    }
}
