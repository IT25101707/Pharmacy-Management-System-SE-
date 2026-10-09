package Pharmacy.management.system.service;

import Pharmacy.management.system.entity.User;
import Pharmacy.management.system.repository.UserRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;

    private final BCryptPasswordEncoder passwordEncoder =
            new BCryptPasswordEncoder();

    public AuthService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User login(
            String username,
            String password) {

        if (username == null || username.isBlank()) {
            return null;
        }

        if (password == null || password.isBlank()) {
            return null;
        }

        User user = userRepository
                .findByUsername(username)
                .orElse(null);

        if (user == null) {
            return null;
        }

        if (user.getPassword() == null
                || user.getPassword().isBlank()) {
            return null;
        }

        if (passwordEncoder.matches(
                password,
                user.getPassword())) {

            return user;
        }

        return null;
    }
}