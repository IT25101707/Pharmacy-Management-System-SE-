package Pharmacy.management.system.controller;

import Pharmacy.management.system.entity.Prescription;
import Pharmacy.management.system.entity.Role;
import Pharmacy.management.system.service.PrescriptionService;
import Pharmacy.management.system.service.RoleAuthorizationService;
import jakarta.servlet.http.HttpSession;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/prescriptions")
public class PrescriptionController {

    private final PrescriptionService prescriptionService;
    private final RoleAuthorizationService roleAuthorizationService;

    public PrescriptionController(
            PrescriptionService prescriptionService,
            RoleAuthorizationService roleAuthorizationService) {

        this.prescriptionService = prescriptionService;
        this.roleAuthorizationService = roleAuthorizationService;
    }

    // =====================================================
    // CREATE PRESCRIPTION
    // ADMIN + PHARMACIST
    // =====================================================

    @PostMapping
    public Prescription createPrescription(
            @RequestBody Prescription prescription,
            HttpSession session) {

        roleAuthorizationService.requireAnyRole(
                session,
                Role.ADMIN,
                Role.PHARMACIST
        );

        return prescriptionService.savePrescription(prescription);
    }

    // =====================================================
    // READ ALL PRESCRIPTIONS
    // ADMIN + PHARMACIST + INVENTORY_OFFICER
    // =====================================================

    @GetMapping
    public List<Prescription> getAllPrescriptions(
            HttpSession session) {

        roleAuthorizationService.requireAnyRole(
                session,
                Role.ADMIN,
                Role.PHARMACIST,
                Role.INVENTORY_OFFICER
        );

        return prescriptionService.getAllPrescriptions();
    }

    // =====================================================
    // READ ONE PRESCRIPTION
    // ADMIN + PHARMACIST + INVENTORY_OFFICER
    // =====================================================

    @GetMapping("/{id}")
    public Prescription getPrescriptionById(
            @PathVariable Long id,
            HttpSession session) {

        roleAuthorizationService.requireAnyRole(
                session,
                Role.ADMIN,
                Role.PHARMACIST,
                Role.INVENTORY_OFFICER
        );

        return prescriptionService.getPrescriptionById(id);
    }

    // =====================================================
    // UPDATE PRESCRIPTION
    // ADMIN + PHARMACIST
    // =====================================================

    @PutMapping("/{id}")
    public Prescription updatePrescription(
            @PathVariable Long id,
            @RequestBody Prescription prescription,
            HttpSession session) {

        roleAuthorizationService.requireAnyRole(
                session,
                Role.ADMIN,
                Role.PHARMACIST
        );

        return prescriptionService.updatePrescription(
                id,
                prescription
        );
    }

    // =====================================================
    // DELETE PRESCRIPTION
    // ADMIN + PHARMACIST
    // =====================================================

    @DeleteMapping("/{id}")
    public void deletePrescription(
            @PathVariable Long id,
            HttpSession session) {

        roleAuthorizationService.requireAnyRole(
                session,
                Role.ADMIN,
                Role.PHARMACIST
        );

        prescriptionService.deletePrescription(id);
    }
}