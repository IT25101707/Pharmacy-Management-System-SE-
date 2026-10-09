package Pharmacy.management.system.controller;

import Pharmacy.management.system.entity.Notification;
import Pharmacy.management.system.entity.Role;
import Pharmacy.management.system.service.NotificationService;
import Pharmacy.management.system.service.RoleAuthorizationService;

import jakarta.servlet.http.HttpSession;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private final NotificationService notificationService;

    private final RoleAuthorizationService
            roleAuthorizationService;


    public NotificationController(
            NotificationService notificationService,
            RoleAuthorizationService roleAuthorizationService
    ) {

        this.notificationService =
                notificationService;

        this.roleAuthorizationService =
                roleAuthorizationService;
    }


    // =========================================================
    // GET ACTIVE NOTIFICATIONS
    // =========================================================

    @GetMapping
    public List<Notification> getNotifications(
            HttpSession session
    ) {

        roleAuthorizationService.requireAnyRole(
                session,
                Role.ADMIN,
                Role.INVENTORY_OFFICER,
                Role.SUPPLIER
        );


        return notificationService
                .getActiveNotifications();
    }


    // =========================================================
    // GET ACTIVE NOTIFICATION COUNT
    // =========================================================

    @GetMapping("/count")
    public long getNotificationCount(
            HttpSession session
    ) {

        roleAuthorizationService.requireAnyRole(
                session,
                Role.ADMIN,
                Role.INVENTORY_OFFICER,
                Role.SUPPLIER
        );


        return notificationService
                .getActiveNotificationCount();
    }
}