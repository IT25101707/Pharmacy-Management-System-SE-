package Pharmacy.management.system.service;

import Pharmacy.management.system.entity.User;
import Pharmacy.management.system.repository.UserRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    private final UserRepository userRepository;

    private final BCryptPasswordEncoder passwordEncoder =
            new BCryptPasswordEncoder();


    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }


    // =========================================================
    // CREATE USER
    // =========================================================

    public User createUser(User user) {

        validateUser(user, true);

        String username = user.getUsername().trim();

        if (userRepository.existsByUsername(username)) {

            throw new IllegalArgumentException(
                    "Username '" + username + "' already exists. Please choose another username."
            );
        }

        user.setUsername(username);

        user.setPassword(
                passwordEncoder.encode(
                        user.getPassword()
                )
        );

        return userRepository.save(user);
    }


    // =========================================================
    // GET ALL USERS
    // =========================================================

    public List<User> getAllUsers() {

        return userRepository.findAll();
    }


    // =========================================================
    // GET USER BY ID
    // =========================================================

    public User getUserById(Long id) {

        return userRepository
                .findById(id)
                .orElse(null);
    }


    // =========================================================
    // UPDATE USER
    // =========================================================

    public User updateUser(
            Long id,
            User user
    ) {

        User existingUser =
                userRepository
                        .findById(id)
                        .orElse(null);

        if (existingUser == null) {

            return null;
        }


        validateUser(user, false);


        String newUsername =
                user.getUsername().trim();


        // Check username only if username changed
        if (!existingUser
                .getUsername()
                .equalsIgnoreCase(newUsername)) {

            if (userRepository.existsByUsername(newUsername)) {

                throw new IllegalArgumentException(
                        "Username '" + newUsername
                                + "' already exists. Please choose another username."
                );
            }
        }


        existingUser.setName(
                user.getName().trim()
        );

        existingUser.setUsername(
                newUsername
        );

        existingUser.setRole(
                user.getRole()
        );

        existingUser.setEmail(
                user.getEmail().trim()
        );

        existingUser.setPhone(
                user.getPhone().trim()
        );


        // Only update password if user entered a new password
        if (user.getPassword() != null
                && !user.getPassword().isBlank()) {

            existingUser.setPassword(
                    passwordEncoder.encode(
                            user.getPassword()
                    )
            );
        }


        return userRepository.save(
                existingUser
        );
    }


    // =========================================================
    // DELETE USER
    // =========================================================

    public void deleteUser(Long id) {

        if (!userRepository.existsById(id)) {

            throw new IllegalArgumentException(
                    "User not found."
            );
        }

        userRepository.deleteById(id);
    }


    // =========================================================
    // VALIDATION
    // =========================================================

    private void validateUser(
            User user,
            boolean passwordRequired
    ) {

        if (user == null) {

            throw new IllegalArgumentException(
                    "User data is required."
            );
        }


        if (user.getName() == null
                || user.getName().isBlank()) {

            throw new IllegalArgumentException(
                    "Name is required."
            );
        }


        if (user.getUsername() == null
                || user.getUsername().isBlank()) {

            throw new IllegalArgumentException(
                    "Username is required."
            );
        }


        if (passwordRequired
                && (user.getPassword() == null
                || user.getPassword().isBlank())) {

            throw new IllegalArgumentException(
                    "Password is required."
            );
        }


        if (user.getRole() == null) {

            throw new IllegalArgumentException(
                    "Role is required."
            );
        }


        if (user.getEmail() == null
                || user.getEmail().isBlank()) {

            throw new IllegalArgumentException(
                    "Email is required."
            );
        }


        if (!user.getEmail().matches(
                "^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$"
        )) {

            throw new IllegalArgumentException(
                    "Enter a valid email address."
            );
        }


        if (user.getPhone() == null
                || user.getPhone().isBlank()) {

            throw new IllegalArgumentException(
                    "Phone number is required."
            );
        }


        if (!user.getPhone().matches(
                "^(\\+94|0)7[0-9]{8}$"
        )) {

            throw new IllegalArgumentException(
                    "Enter a valid Sri Lankan phone number."
            );
        }
    }
}