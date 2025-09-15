package dev.doomsday.suitX.controller;

import dev.doomsday.suitX.model.User;
import dev.doomsday.suitX.service.UserService;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthController {
    private final UserService userService;

    public AuthController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/signup")
    public String signup(@RequestBody User user) {
        userService.signup(user);
        return "User registered!";
    }

    @PostMapping("/login")
    public String login(@RequestBody Map<String, String> body) {
        String username = body.get("username");
        String password = body.get("password");

        return userService.findByUsername(username)
                .filter(u -> userService.checkPassword(password, u.getPassword()))
                .map(u -> "JWT_TOKEN_PLACEHOLDER") // TODO: replace with real JWT token
                .orElse("Invalid credentials");
    }

    // test
    @GetMapping("/")
    public String authHome() {
        return "Auth API is running!";
    }
    // end test
}