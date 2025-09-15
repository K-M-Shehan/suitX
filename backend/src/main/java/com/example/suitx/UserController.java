package com.example.suitx;

import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000") // React frontend
public class UserController {

    private List<User> users = new ArrayList<>();

    @PostMapping("/signup")
    public String signup(@RequestBody User user) {
        for (User u : users) {
            if (u.getEmail().equals(user.getEmail())) {
                return "Email already exists!";
            }
        }
        users.add(user);
        return "Signup successful!";
    }

    @PostMapping("/login")
    public String login(@RequestBody User user) {
        for (User u : users) {
            if (u.getEmail().equals(user.getEmail()) &&
                    u.getPassword().equals(user.getPassword())) {
                return "Login successful!";
            }
        }
        return "Invalid credentials!";
    }
}
