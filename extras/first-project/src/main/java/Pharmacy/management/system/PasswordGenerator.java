package Pharmacy.management.system;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class PasswordGenerator {

    public static void main(String[] args) {

        BCryptPasswordEncoder encoder =
                new BCryptPasswordEncoder();

        String hashedPassword =
                encoder.encode("1234");

        System.out.println(hashedPassword);
    }
}