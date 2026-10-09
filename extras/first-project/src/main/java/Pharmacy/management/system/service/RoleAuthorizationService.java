package Pharmacy.management.system.service;

import Pharmacy.management.system.entity.Role;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class RoleAuthorizationService {

    public boolean isLoggedIn(HttpSession session) {
        return session.getAttribute("userId") != null;
    }

    public Role getCurrentRole(HttpSession session) {

        Object roleObject = session.getAttribute("role");

        if (roleObject == null) {
            return null;
        }

        try {
            return Role.valueOf(
                    roleObject.toString().toUpperCase()
            );
        } catch (IllegalArgumentException e) {
            return null;
        }
    }

    public boolean hasAnyRole(
            HttpSession session,
            Role... allowedRoles) {

        Role currentRole = getCurrentRole(session);

        if (currentRole == null) {
            return false;
        }

        for (Role allowedRole : allowedRoles) {

            if (currentRole == allowedRole) {
                return true;
            }
        }

        return false;
    }

    public void requireAnyRole(
            HttpSession session,
            Role... allowedRoles) {

        if (!isLoggedIn(session)) {

            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "Please login first"
            );
        }

        if (!hasAnyRole(session, allowedRoles)) {

            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "You do not have permission to access this resource"
            );
        }
    }
}