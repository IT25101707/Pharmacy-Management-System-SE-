package Pharmacy.management.system.controller;

import Pharmacy.management.system.entity.Role;
import Pharmacy.management.system.entity.User;
import Pharmacy.management.system.service.RoleAuthorizationService;
import Pharmacy.management.system.service.UserService;

import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;
    private final RoleAuthorizationService roleAuthorizationService;

    public UserController(
            UserService userService,
            RoleAuthorizationService roleAuthorizationService
    ) {
        this.userService = userService;
        this.roleAuthorizationService = roleAuthorizationService;
    }

    // =========================================================
    // CREATE USER
    // =========================================================

    @PostMapping
    public ResponseEntity<?> createUser(
            @Valid @RequestBody User user,
            HttpSession session
    ) {

        /*
         * FIRST USER BOOTSTRAP
         *
         * When the users table is completely empty,
         * allow creation of the first ADMIN account without
         * requiring an existing login.
         */
        boolean noUsersExist =
                userService.getAllUsers().isEmpty();

        if (noUsersExist) {

            // The first account must always be ADMIN.
            if (user.getRole() != Role.ADMIN) {
                return ResponseEntity
                        .status(HttpStatus.FORBIDDEN)
                        .body(
                                Map.of(
                                        "error",
                                        "The first user must have the ADMIN role."
                                )
                        );
            }

        } else {

            /*
             * After the first user exists,
             * only ADMIN can create other users.
             */
            roleAuthorizationService.requireAnyRole(
                    session,
                    Role.ADMIN
            );
        }

        try {

            User savedUser =
                    userService.createUser(user);

            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(
                            new UserResponse(savedUser)
                    );

        } catch (IllegalArgumentException e) {

            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body(
                            Map.of(
                                    "error",
                                    e.getMessage()
                            )
                    );
        }
    }

    // =========================================================
    // GET ALL USERS
    // =========================================================

    @GetMapping
    public ResponseEntity<List<UserResponse>> getAllUsers(
            HttpSession session
    ) {

        roleAuthorizationService.requireAnyRole(
                session,
                Role.ADMIN
        );

        List<UserResponse> users =
                userService
                        .getAllUsers()
                        .stream()
                        .map(UserResponse::new)
                        .toList();

        return ResponseEntity.ok(users);
    }

    // =========================================================
    // GET USER BY ID
    // =========================================================

    @GetMapping("/{id}")
    public ResponseEntity<?> getUserById(
            @PathVariable Long id,
            HttpSession session
    ) {

        roleAuthorizationService.requireAnyRole(
                session,
                Role.ADMIN
        );

        User user =
                userService.getUserById(id);

        if (user == null) {

            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(
                            Map.of(
                                    "error",
                                    "User not found."
                            )
                    );
        }

        return ResponseEntity.ok(
                new UserResponse(user)
        );
    }

    // =========================================================
    // UPDATE USER
    // =========================================================

    @PutMapping("/{id}")
    public ResponseEntity<?> updateUser(
            @PathVariable Long id,
            @Valid @RequestBody User user,
            HttpSession session
    ) {

        roleAuthorizationService.requireAnyRole(
                session,
                Role.ADMIN
        );

        try {

            User updatedUser =
                    userService.updateUser(
                            id,
                            user
                    );

            if (updatedUser == null) {

                return ResponseEntity
                        .status(HttpStatus.NOT_FOUND)
                        .body(
                                Map.of(
                                        "error",
                                        "User not found."
                                )
                        );
            }

            return ResponseEntity.ok(
                    new UserResponse(updatedUser)
            );

        } catch (IllegalArgumentException e) {

            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body(
                            Map.of(
                                    "error",
                                    e.getMessage()
                            )
                    );
        }
    }

    // =========================================================
    // DELETE USER
    // =========================================================

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(
            @PathVariable Long id,
            HttpSession session
    ) {

        roleAuthorizationService.requireAnyRole(
                session,
                Role.ADMIN
        );

        try {

            userService.deleteUser(id);

            return ResponseEntity.ok(
                    Map.of(
                            "message",
                            "User deleted successfully."
                    )
            );

        } catch (IllegalArgumentException e) {

            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(
                            Map.of(
                                    "error",
                                    e.getMessage()
                            )
                    );
        }
    }

    // =========================================================
    // USER RESPONSE DTO
    //
    // Password is intentionally NOT returned.
    // =========================================================

    public static class UserResponse {

        private Long id;

        private String name;

        private String username;

        private String email;

        private String phone;

        private Role role;

        public UserResponse(User user) {

            this.id = user.getId();

            this.name = user.getName();

            this.username = user.getUsername();

            this.email = user.getEmail();

            this.phone = user.getPhone();

            this.role = user.getRole();
        }

        public Long getId() {
            return id;
        }

        public String getName() {
            return name;
        }

        public String getUsername() {
            return username;
        }

        public String getEmail() {
            return email;
        }

        public String getPhone() {
            return phone;
        }

        public Role getRole() {
            return role;
        }
    }
}