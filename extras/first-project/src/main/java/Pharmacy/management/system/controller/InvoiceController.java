package Pharmacy.management.system.controller;

import Pharmacy.management.system.entity.Invoice;
import Pharmacy.management.system.entity.Role;
import Pharmacy.management.system.service.InvoiceService;
import Pharmacy.management.system.service.RoleAuthorizationService;
import jakarta.servlet.http.HttpSession;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/invoices")
public class InvoiceController {

    private final InvoiceService invoiceService;
    private final RoleAuthorizationService roleAuthorizationService;

    public InvoiceController(
            InvoiceService invoiceService,
            RoleAuthorizationService roleAuthorizationService) {

        this.invoiceService = invoiceService;
        this.roleAuthorizationService = roleAuthorizationService;
    }

    // =====================================================
    // CREATE INVOICE
    // ADMIN + FINANCE_OFFICER
    // =====================================================

    @PostMapping
    public Invoice createInvoice(
            @RequestBody Invoice invoice,
            HttpSession session) {

        roleAuthorizationService.requireAnyRole(
                session,
                Role.ADMIN,
                Role.FINANCE_OFFICER
        );

        return invoiceService.saveInvoice(invoice);
    }

    // =====================================================
    // READ ALL INVOICES
    // ADMIN + FINANCE_OFFICER
    // SALES_OFFICER - VIEW ONLY
    // PHARMACIST - VIEW ONLY
    // =====================================================

    @GetMapping
    public List<Invoice> getAllInvoices(
            HttpSession session) {

        roleAuthorizationService.requireAnyRole(
                session,
                Role.ADMIN,
                Role.FINANCE_OFFICER,
                Role.SALES_OFFICER,
                Role.PHARMACIST
        );

        return invoiceService.getAllInvoices();
    }

    // =====================================================
    // READ ONE INVOICE
    // ADMIN + FINANCE_OFFICER
    // SALES_OFFICER - VIEW ONLY
    // PHARMACIST - VIEW ONLY
    // =====================================================

    @GetMapping("/{id}")
    public Invoice getInvoiceById(
            @PathVariable Long id,
            HttpSession session) {

        roleAuthorizationService.requireAnyRole(
                session,
                Role.ADMIN,
                Role.FINANCE_OFFICER,
                Role.SALES_OFFICER,
                Role.PHARMACIST
        );

        return invoiceService.getInvoiceById(id);
    }

    // =====================================================
    // UPDATE INVOICE
    // ADMIN + FINANCE_OFFICER
    // =====================================================

    @PutMapping("/{id}")
    public Invoice updateInvoice(
            @PathVariable Long id,
            @RequestBody Invoice invoice,
            HttpSession session) {

        roleAuthorizationService.requireAnyRole(
                session,
                Role.ADMIN,
                Role.FINANCE_OFFICER
        );

        return invoiceService.updateInvoice(
                id,
                invoice
        );
    }

    // =====================================================
    // DELETE INVOICE
    // ADMIN + FINANCE_OFFICER
    // =====================================================

    @DeleteMapping("/{id}")
    public void deleteInvoice(
            @PathVariable Long id,
            HttpSession session) {

        roleAuthorizationService.requireAnyRole(
                session,
                Role.ADMIN,
                Role.FINANCE_OFFICER
        );

        invoiceService.deleteInvoice(id);
    }
}