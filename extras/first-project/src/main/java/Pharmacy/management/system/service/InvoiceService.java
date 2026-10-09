package Pharmacy.management.system.service;

import Pharmacy.management.system.entity.Invoice;
import Pharmacy.management.system.repository.InvoiceRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class InvoiceService {

    private final InvoiceRepository invoiceRepository;

    public InvoiceService(InvoiceRepository invoiceRepository) {
        this.invoiceRepository = invoiceRepository;
    }

    // =====================================================
    // CREATE INVOICE
    // =====================================================

    public Invoice saveInvoice(Invoice invoice) {

        validateInvoice(invoice);

        return invoiceRepository.save(invoice);
    }

    // =====================================================
    // READ ALL INVOICES
    // =====================================================

    public List<Invoice> getAllInvoices() {

        return invoiceRepository.findAll();
    }

    // =====================================================
    // READ ONE INVOICE
    // =====================================================

    public Invoice getInvoiceById(Long id) {

        return invoiceRepository
                .findById(id)
                .orElse(null);
    }

    // =====================================================
    // UPDATE INVOICE
    // =====================================================

    public Invoice updateInvoice(
            Long id,
            Invoice invoice) {

        Invoice existingInvoice =
                invoiceRepository
                        .findById(id)
                        .orElse(null);

        if (existingInvoice == null) {
            return null;
        }

        validateInvoice(invoice);

        existingInvoice.setMedicineName(
                invoice.getMedicineName()
        );

        existingInvoice.setQuantity(
                invoice.getQuantity()
        );

        existingInvoice.setTotalAmount(
                invoice.getTotalAmount()
        );

        existingInvoice.setDate(
                invoice.getDate()
        );

        return invoiceRepository.save(existingInvoice);
    }

    // =====================================================
    // DELETE INVOICE
    // =====================================================

    public void deleteInvoice(Long id) {

        if (!invoiceRepository.existsById(id)) {

            throw new IllegalArgumentException(
                    "Invoice not found"
            );
        }

        invoiceRepository.deleteById(id);
    }

    // =====================================================
    // VALIDATION
    // =====================================================

    private void validateInvoice(Invoice invoice) {

        if (invoice == null) {

            throw new IllegalArgumentException(
                    "Invoice data is required"
            );
        }

        if (invoice.getMedicineName() == null
                || invoice.getMedicineName().isBlank()) {

            throw new IllegalArgumentException(
                    "Medicine name is required"
            );
        }

        if (invoice.getQuantity() <= 0) {

            throw new IllegalArgumentException(
                    "Quantity must be greater than 0"
            );
        }

        if (invoice.getTotalAmount() <= 0) {

            throw new IllegalArgumentException(
                    "Total amount must be greater than 0"
            );
        }

        if (invoice.getDate() == null
                || invoice.getDate().isBlank()) {

            throw new IllegalArgumentException(
                    "Invoice date is required"
            );
        }
    }
}