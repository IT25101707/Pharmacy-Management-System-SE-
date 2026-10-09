package Pharmacy.management.system.controller;

import Pharmacy.management.system.entity.User;
import Pharmacy.management.system.service.AuthService;
import Pharmacy.management.system.service.DashboardService;

import jakarta.servlet.http.HttpSession;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.Map;

@Controller
public class PageController {

    private final DashboardService dashboardService;
    private final AuthService authService;

    public PageController(
            DashboardService dashboardService,
            AuthService authService
    ) {
        this.dashboardService = dashboardService;
        this.authService = authService;
    }


    // =====================================================
    // HOME
    // =====================================================

    @GetMapping("/")
    public String home() {
        return "login";
    }


    // =====================================================
    // LOGIN PAGE
    // =====================================================

    @GetMapping("/login")
    public String loginPage() {
        return "login";
    }


    // =====================================================
    // LOGIN
    // =====================================================

    @PostMapping("/login")
    public String login(
            @RequestParam String username,
            @RequestParam String password,
            HttpSession session,
            Model model
    ) {

        User user = authService.login(
                username,
                password
        );

        if (user == null) {

            model.addAttribute(
                    "error",
                    "Invalid username or password"
            );

            return "login";
        }


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

        session.setAttribute(
                "role",
                user.getRole().name()
        );


        switch (user.getRole()) {

            case ADMIN:
            case PHARMACIST:
            case INVENTORY_OFFICER:
            case FINANCE_OFFICER:
            case SALES_OFFICER:
            case SUPPLIER:

                return "redirect:/dashboard";

            default:

                model.addAttribute(
                        "error",
                        "User role is not configured"
                );

                return "login";
        }
    }


    // =====================================================
    // LOGOUT
    // =====================================================

    @GetMapping("/logout")
    public String logout(
            HttpSession session
    ) {

        session.invalidate();

        return "redirect:/login";
    }


    // =====================================================
    // DASHBOARD
    // ALL SIX ROLES
    // =====================================================

    @GetMapping("/dashboard")
    public String dashboard(
            Model model,
            HttpSession session
    ) {

        if (!isLoggedIn(session)) {
            return "redirect:/login";
        }


        String role = getRole(session);


        if (!hasRole(
                role,
                "ADMIN",
                "PHARMACIST",
                "INVENTORY_OFFICER",
                "FINANCE_OFFICER",
                "SALES_OFFICER",
                "SUPPLIER"
        )) {

            return "redirect:/login";
        }


        Map<String, Object> stats =
                dashboardService.getDashboardStats();


        model.addAttribute(
                "medicineCount",
                stats.get("medicineCount")
        );

        model.addAttribute(
                "supplierCount",
                stats.get("supplierCount")
        );

        model.addAttribute(
                "stockCount",
                stats.get("stockCount")
        );

        model.addAttribute(
                "lowStockCount",
                stats.get("lowStockCount")
        );

        model.addAttribute(
                "expiringCount",
                stats.get("expiringCount")
        );

        model.addAttribute(
                "prescriptionCount",
                stats.get("prescriptionCount")
        );

        model.addAttribute(
                "salesCount",
                stats.get("salesCount")
        );

        model.addAttribute(
                "invoiceCount",
                stats.get("invoiceCount")
        );

        model.addAttribute(
                "totalRevenue",
                stats.get("totalRevenue")
        );


        model.addAttribute(
                "role",
                role
        );

        model.addAttribute(
                "userName",
                session.getAttribute("userName")
        );


        return "dashboard";
    }


    // =====================================================
    // USERS & STAKEHOLDERS
    // ADMIN ONLY
    // =====================================================

    @GetMapping("/users")
    public String users(
            HttpSession session
    ) {

        if (!isLoggedIn(session)) {
            return "redirect:/login";
        }


        if (!hasRole(
                getRole(session),
                "ADMIN"
        )) {

            return redirectToCorrectDashboard(
                    getRole(session)
            );
        }


        return "users";
    }


    // =====================================================
    // MEDICINES
    // ADMIN
    // PHARMACIST
    // INVENTORY OFFICER
    // SALES OFFICER
    // =====================================================

    @GetMapping("/medicines")
    public String medicines(
            HttpSession session
    ) {

        if (!isLoggedIn(session)) {
            return "redirect:/login";
        }


        if (!hasRole(
                getRole(session),
                "ADMIN",
                "PHARMACIST",
                "INVENTORY_OFFICER",
                "SALES_OFFICER"
        )) {

            return redirectToCorrectDashboard(
                    getRole(session)
            );
        }


        return "medicine";
    }


    // =====================================================
    // SUPPLIERS
    // ADMIN
    // INVENTORY OFFICER
    // SUPPLIER
    // =====================================================

    @GetMapping("/suppliers")
    public String suppliers(
            HttpSession session
    ) {

        if (!isLoggedIn(session)) {
            return "redirect:/login";
        }


        if (!hasRole(
                getRole(session),
                "ADMIN",
                "INVENTORY_OFFICER",
                "SUPPLIER"
        )) {

            return redirectToCorrectDashboard(
                    getRole(session)
            );
        }


        return "supplier";
    }


    // =====================================================
    // STOCK
    //
    // ADMIN             = CRUD
    // PHARMACIST        = READ
    // INVENTORY_OFFICER = CRUD
    // SALES_OFFICER     = READ
    // SUPPLIER          = READ ONLY
    // =====================================================

    @GetMapping("/stock")
    public String stock(
            HttpSession session
    ) {

        if (!isLoggedIn(session)) {
            return "redirect:/login";
        }


        if (!hasRole(
                getRole(session),
                "ADMIN",
                "PHARMACIST",
                "INVENTORY_OFFICER",
                "SALES_OFFICER",
                "SUPPLIER"
        )) {

            return redirectToCorrectDashboard(
                    getRole(session)
            );
        }


        return "stock";
    }


    // =====================================================
    // PRESCRIPTIONS
    // ADMIN
    // PHARMACIST
    // INVENTORY OFFICER
    // =====================================================

    @GetMapping("/prescriptions")
    public String prescriptions(
            HttpSession session
    ) {

        if (!isLoggedIn(session)) {
            return "redirect:/login";
        }


        if (!hasRole(
                getRole(session),
                "ADMIN",
                "PHARMACIST",
                "INVENTORY_OFFICER"
        )) {

            return redirectToCorrectDashboard(
                    getRole(session)
            );
        }


        return "prescription";
    }


    // =====================================================
    // SALES
    // ADMIN
    // PHARMACIST
    // FINANCE OFFICER
    // SALES OFFICER
    // =====================================================

    @GetMapping("/sales")
    public String sales(
            HttpSession session
    ) {

        if (!isLoggedIn(session)) {
            return "redirect:/login";
        }


        if (!hasRole(
                getRole(session),
                "ADMIN",
                "PHARMACIST",
                "FINANCE_OFFICER",
                "SALES_OFFICER"
        )) {

            return redirectToCorrectDashboard(
                    getRole(session)
            );
        }


        return "sale";
    }


    // =====================================================
    // INVOICES
    // ADMIN
    // FINANCE OFFICER
    // SALES OFFICER
    // PHARMACIST
    // =====================================================

    @GetMapping("/invoices")
    public String invoices(
            HttpSession session
    ) {

        if (!isLoggedIn(session)) {
            return "redirect:/login";
        }


        if (!hasRole(
                getRole(session),
                "ADMIN",
                "FINANCE_OFFICER",
                "SALES_OFFICER",
                "PHARMACIST"
        )) {

            return redirectToCorrectDashboard(
                    getRole(session)
            );
        }


        return "invoice";
    }


    // =====================================================
    // CHECK LOGIN
    // =====================================================

    private boolean isLoggedIn(
            HttpSession session
    ) {

        return session.getAttribute(
                "userId"
        ) != null;
    }


    // =====================================================
    // GET CURRENT ROLE
    // =====================================================

    private String getRole(
            HttpSession session
    ) {

        Object role =
                session.getAttribute("role");


        if (role == null) {
            return "";
        }


        return role.toString();
    }


    // =====================================================
    // CHECK ROLE
    // =====================================================

    private boolean hasRole(
            String currentRole,
            String... allowedRoles
    ) {

        for (String allowedRole : allowedRoles) {

            if (allowedRole.equalsIgnoreCase(
                    currentRole
            )) {

                return true;
            }
        }


        return false;
    }


    // =====================================================
    // REDIRECT
    // =====================================================

    private String redirectToCorrectDashboard(
            String role
    ) {

        return "redirect:/dashboard";
    }
}