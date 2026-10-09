package Pharmacy.management.system.dto;

import Pharmacy.management.system.entity.Role;
import Pharmacy.management.system.entity.User;

public class UserResponse {

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