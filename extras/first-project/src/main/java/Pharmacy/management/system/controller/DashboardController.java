package Pharmacy.management.system.controller;

import Pharmacy.management.system.entity.Role;
import Pharmacy.management.system.service.DashboardService;
import Pharmacy.management.system.service.RoleAuthorizationService;
import jakarta.servlet.http.HttpSession;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final DashboardService dashboardService;

    private final RoleAuthorizationService
            roleAuthorizationService;


    public DashboardController(
            DashboardService dashboardService,
            RoleAuthorizationService roleAuthorizationService) {

        this.dashboardService =
                dashboardService;

        this.roleAuthorizationService =
                roleAuthorizationService;
    }


    // =====================================================
    // DASHBOARD STATISTICS
    //
    // Allowed:
    // ADMIN
    // PHARMACIST
    // INVENTORY_OFFICER
    // FINANCE_OFFICER
    // SALES_OFFICER
    // SUPPLIER
    // =====================================================

    @GetMapping("/stats")
    public Map<String, Object> getDashboardStats(
            HttpSession session) {

        roleAuthorizationService.requireAnyRole(
                session,
                Role.ADMIN,
                Role.PHARMACIST,
                Role.INVENTORY_OFFICER,
                Role.FINANCE_OFFICER,
                Role.SALES_OFFICER,
                Role.SUPPLIER
        );


        return dashboardService
                .getDashboardStats();
    }
}