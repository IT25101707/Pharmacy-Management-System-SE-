package Pharmacy.management.system.controller;

import Pharmacy.management.system.dto.LoginResponse;
import Pharmacy.management.system.entity.User;
import Pharmacy.management.system.service.AuthService;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }


    @PostMapping("/login")
    public ResponseEntity<?> login(
            @RequestParam String username,
            @RequestParam String password,
            HttpSession session) {

        User user = authService.login(username, password);

        if (user != null) {

            // Store logged-in user in session
            session.setAttribute(
                    "userId",
                    user.getId()
            );

            session.setAttribute(
                    "userName",
                    user.getName()
            );

            session.setAttribute(
                    "username",
                    user.getUsername()
            );

            // Store role as String in session
            session.setAttribute(
                    "role",
                    user.getRole().name()
            );


            // Login response
            LoginResponse response =
                    new LoginResponse(
                            user.getId(),
                            user.getName(),
                            user.getUsername(),
                            user.getRole().name()
                    );


            return ResponseEntity.ok(response);
        }


        return ResponseEntity
                .status(401)
                .body("Invalid username or password");
    }
}