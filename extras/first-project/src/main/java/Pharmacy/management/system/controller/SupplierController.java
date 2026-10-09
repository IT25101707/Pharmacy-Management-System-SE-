package Pharmacy.management.system.controller;

import Pharmacy.management.system.entity.Role;
import Pharmacy.management.system.entity.Supplier;
import Pharmacy.management.system.service.RoleAuthorizationService;
import Pharmacy.management.system.service.SupplierService;
import jakarta.servlet.http.HttpSession;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/suppliers")
public class SupplierController {

    private final SupplierService supplierService;
    private final RoleAuthorizationService roleAuthorizationService;

    public SupplierController(
            SupplierService supplierService,
            RoleAuthorizationService roleAuthorizationService) {

        this.supplierService = supplierService;
        this.roleAuthorizationService = roleAuthorizationService;
    }

    // =====================================================
    // CREATE SUPPLIER
    // ADMIN + INVENTORY OFFICER + SUPPLIER
    // =====================================================

    @PostMapping
    public Supplier createSupplier(
            @RequestBody Supplier supplier,
            HttpSession session) {

        roleAuthorizationService.requireAnyRole(
                session,
                Role.ADMIN,
                Role.INVENTORY_OFFICER,
                Role.SUPPLIER
        );

        return supplierService.createSupplier(supplier);
    }

    // =====================================================
    // READ ALL SUPPLIERS
    // ADMIN + INVENTORY OFFICER + SUPPLIER
    // =====================================================

    @GetMapping
    public List<Supplier> getAllSuppliers(
            HttpSession session) {

        roleAuthorizationService.requireAnyRole(
                session,
                Role.ADMIN,
                Role.INVENTORY_OFFICER,
                Role.SUPPLIER
        );

        return supplierService.getAllSuppliers();
    }

    // =====================================================
    // READ ONE SUPPLIER
    // ADMIN + INVENTORY OFFICER + SUPPLIER
    // =====================================================

    @GetMapping("/{id}")
    public Supplier getSupplierById(
            @PathVariable Long id,
            HttpSession session) {

        roleAuthorizationService.requireAnyRole(
                session,
                Role.ADMIN,
                Role.INVENTORY_OFFICER,
                Role.SUPPLIER
        );

        return supplierService.getSupplierById(id);
    }

    // =====================================================
    // UPDATE SUPPLIER
    // ADMIN + INVENTORY OFFICER + SUPPLIER
    // =====================================================

    @PutMapping("/{id}")
    public Supplier updateSupplier(
            @PathVariable Long id,
            @RequestBody Supplier supplier,
            HttpSession session) {

        roleAuthorizationService.requireAnyRole(
                session,
                Role.ADMIN,
                Role.INVENTORY_OFFICER,
                Role.SUPPLIER
        );

        return supplierService.updateSupplier(
                id,
                supplier
        );
    }

    // =====================================================
    // DELETE SUPPLIER
    // ADMIN + INVENTORY OFFICER + SUPPLIER
    // =====================================================

    @DeleteMapping("/{id}")
    public void deleteSupplier(
            @PathVariable Long id,
            HttpSession session) {

        roleAuthorizationService.requireAnyRole(
                session,
                Role.ADMIN,
                Role.INVENTORY_OFFICER,
                Role.SUPPLIER
        );

        supplierService.deleteSupplier(id);
    }
}