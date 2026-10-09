package Pharmacy.management.system.controller;

import Pharmacy.management.system.entity.Role;
import Pharmacy.management.system.entity.Sale;
import Pharmacy.management.system.service.RoleAuthorizationService;
import Pharmacy.management.system.service.SaleService;
import jakarta.servlet.http.HttpSession;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sales")
public class SaleController {

    private final SaleService saleService;
    private final RoleAuthorizationService roleAuthorizationService;

    public SaleController(
            SaleService saleService,
            RoleAuthorizationService roleAuthorizationService) {

        this.saleService = saleService;
        this.roleAuthorizationService = roleAuthorizationService;
    }

    // CREATE SALE
    // ADMIN + PHARMACIST + SALES_OFFICER
    @PostMapping
    public Sale createSale(
            @RequestBody Sale sale,
            HttpSession session) {

        roleAuthorizationService.requireAnyRole(
                session,
                Role.ADMIN,
                Role.PHARMACIST,
                Role.SALES_OFFICER
        );

        return saleService.saveSale(sale);
    }

    // READ ALL SALES
    // ADMIN + PHARMACIST + FINANCE_OFFICER + SALES_OFFICER
    @GetMapping
    public List<Sale> getAllSales(
            HttpSession session) {

        roleAuthorizationService.requireAnyRole(
                session,
                Role.ADMIN,
                Role.PHARMACIST,
                Role.FINANCE_OFFICER,
                Role.SALES_OFFICER
        );

        return saleService.getAllSales();
    }

    // READ ONE SALE
    // ADMIN + PHARMACIST + FINANCE_OFFICER + SALES_OFFICER
    @GetMapping("/{id}")
    public Sale getSaleById(
            @PathVariable Long id,
            HttpSession session) {

        roleAuthorizationService.requireAnyRole(
                session,
                Role.ADMIN,
                Role.PHARMACIST,
                Role.FINANCE_OFFICER,
                Role.SALES_OFFICER
        );

        return saleService.getSaleById(id);
    }

    // UPDATE SALE
    // ADMIN + PHARMACIST + SALES_OFFICER
    @PutMapping("/{id}")
    public Sale updateSale(
            @PathVariable Long id,
            @RequestBody Sale sale,
            HttpSession session) {

        roleAuthorizationService.requireAnyRole(
                session,
                Role.ADMIN,
                Role.PHARMACIST,
                Role.SALES_OFFICER
        );

        return saleService.updateSale(id, sale);
    }

    // DELETE SALE
    // ADMIN + PHARMACIST + SALES_OFFICER
    @DeleteMapping("/{id}")
    public void deleteSale(
            @PathVariable Long id,
            HttpSession session) {

        roleAuthorizationService.requireAnyRole(
                session,
                Role.ADMIN,
                Role.PHARMACIST,
                Role.SALES_OFFICER
        );

        saleService.deleteSale(id);
    }
}