package Pharmacy.management.system.controller;

import Pharmacy.management.system.entity.Role;
import Pharmacy.management.system.entity.Stock;
import Pharmacy.management.system.service.RoleAuthorizationService;
import Pharmacy.management.system.service.StockService;

import jakarta.servlet.http.HttpSession;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/stock")
public class StockController {

    private final StockService stockService;

    private final RoleAuthorizationService roleAuthorizationService;


    public StockController(
            StockService stockService,
            RoleAuthorizationService roleAuthorizationService
    ) {

        this.stockService = stockService;

        this.roleAuthorizationService =
                roleAuthorizationService;
    }


    // =========================================================
    // CREATE
    // ADMIN + INVENTORY OFFICER ONLY
    // =========================================================

    @PostMapping
    public Stock createStock(
            @RequestBody Stock stock,
            HttpSession session
    ) {

        roleAuthorizationService.requireAnyRole(
                session,
                Role.ADMIN,
                Role.INVENTORY_OFFICER
        );

        return stockService.createStock(stock);
    }


    // =========================================================
    // READ ALL
    // ADMIN + PHARMACIST + INVENTORY OFFICER
    // SALES OFFICER + SUPPLIER
    // =========================================================

    @GetMapping
    public List<Stock> getAllStock(
            HttpSession session
    ) {

        roleAuthorizationService.requireAnyRole(
                session,
                Role.ADMIN,
                Role.PHARMACIST,
                Role.INVENTORY_OFFICER,
                Role.SALES_OFFICER,
                Role.SUPPLIER
        );

        return stockService.getAllStock();
    }


    // =========================================================
    // READ ONE
    // ADMIN + PHARMACIST + INVENTORY OFFICER
    // SALES OFFICER + SUPPLIER
    // =========================================================

    @GetMapping("/{id}")
    public Stock getStockById(
            @PathVariable Long id,
            HttpSession session
    ) {

        roleAuthorizationService.requireAnyRole(
                session,
                Role.ADMIN,
                Role.PHARMACIST,
                Role.INVENTORY_OFFICER,
                Role.SALES_OFFICER,
                Role.SUPPLIER
        );

        return stockService.getStockById(id);
    }


    // =========================================================
    // UPDATE
    // ADMIN + INVENTORY OFFICER ONLY
    // =========================================================

    @PutMapping("/{id}")
    public Stock updateStock(
            @PathVariable Long id,
            @RequestBody Stock stock,
            HttpSession session
    ) {

        roleAuthorizationService.requireAnyRole(
                session,
                Role.ADMIN,
                Role.INVENTORY_OFFICER
        );

        return stockService.updateStock(
                id,
                stock
        );
    }


    // =========================================================
    // DELETE
    // ADMIN + INVENTORY OFFICER ONLY
    // =========================================================

    @DeleteMapping("/{id}")
    public void deleteStock(
            @PathVariable Long id,
            HttpSession session
    ) {

        roleAuthorizationService.requireAnyRole(
                session,
                Role.ADMIN,
                Role.INVENTORY_OFFICER
        );

        stockService.deleteStock(id);
    }


    // =========================================================
    // LOW STOCK
    // ADMIN + PHARMACIST + INVENTORY OFFICER
    // SALES OFFICER + SUPPLIER
    // =========================================================

    @GetMapping("/low")
    public List<Stock> getLowStock(
            HttpSession session
    ) {

        roleAuthorizationService.requireAnyRole(
                session,
                Role.ADMIN,
                Role.PHARMACIST,
                Role.INVENTORY_OFFICER,
                Role.SALES_OFFICER,
                Role.SUPPLIER
        );

        return stockService.getLowStock();
    }
}