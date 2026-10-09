package Pharmacy.management.system.controller;

import Pharmacy.management.system.entity.Medicine;
import Pharmacy.management.system.entity.Role;
import Pharmacy.management.system.service.MedicineService;
import Pharmacy.management.system.service.RoleAuthorizationService;
import jakarta.servlet.http.HttpSession;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/medicines")
public class MedicineController {

    private final MedicineService medicineService;
    private final RoleAuthorizationService roleAuthorizationService;

    public MedicineController(
            MedicineService medicineService,
            RoleAuthorizationService roleAuthorizationService) {

        this.medicineService = medicineService;
        this.roleAuthorizationService = roleAuthorizationService;
    }

    // =====================================================
    // CREATE MEDICINE
    // ADMIN + INVENTORY OFFICER
    // =====================================================

    @PostMapping
    public Medicine createMedicine(
            @RequestBody Medicine medicine,
            HttpSession session) {

        roleAuthorizationService.requireAnyRole(
                session,
                Role.ADMIN,
                Role.INVENTORY_OFFICER
        );

        return medicineService.createMedicine(medicine);
    }

    // =====================================================
    // READ ALL MEDICINES
    // ADMIN + PHARMACIST + INVENTORY OFFICER + SALES OFFICER
    // =====================================================

    @GetMapping
    public List<Medicine> getAllMedicines(
            HttpSession session) {

        roleAuthorizationService.requireAnyRole(
                session,
                Role.ADMIN,
                Role.PHARMACIST,
                Role.INVENTORY_OFFICER,
                Role.SALES_OFFICER
        );

        return medicineService.getAllMedicines();
    }

    // =====================================================
    // READ ONE MEDICINE
    // ADMIN + PHARMACIST + INVENTORY OFFICER + SALES OFFICER
    // =====================================================

    @GetMapping("/{id}")
    public Medicine getMedicineById(
            @PathVariable Long id,
            HttpSession session) {

        roleAuthorizationService.requireAnyRole(
                session,
                Role.ADMIN,
                Role.PHARMACIST,
                Role.INVENTORY_OFFICER,
                Role.SALES_OFFICER
        );

        return medicineService.getMedicineById(id);
    }

    // =====================================================
    // UPDATE MEDICINE
    // ADMIN + INVENTORY OFFICER
    // =====================================================

    @PutMapping("/{id}")
    public Medicine updateMedicine(
            @PathVariable Long id,
            @RequestBody Medicine medicine,
            HttpSession session) {

        roleAuthorizationService.requireAnyRole(
                session,
                Role.ADMIN,
                Role.INVENTORY_OFFICER
        );

        return medicineService.updateMedicine(id, medicine);
    }

    // =====================================================
    // DELETE MEDICINE
    // ADMIN + INVENTORY OFFICER
    // =====================================================

    @DeleteMapping("/{id}")
    public void deleteMedicine(
            @PathVariable Long id,
            HttpSession session) {

        roleAuthorizationService.requireAnyRole(
                session,
                Role.ADMIN,
                Role.INVENTORY_OFFICER
        );

        medicineService.deleteMedicine(id);
    }
}