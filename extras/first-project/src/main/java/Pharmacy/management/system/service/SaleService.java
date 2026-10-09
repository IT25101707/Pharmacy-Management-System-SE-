package Pharmacy.management.system.service;

import Pharmacy.management.system.entity.Invoice;
import Pharmacy.management.system.entity.Sale;
import Pharmacy.management.system.entity.Stock;
import Pharmacy.management.system.repository.InvoiceRepository;
import Pharmacy.management.system.repository.SaleRepository;
import Pharmacy.management.system.repository.StockRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class SaleService {

    private final SaleRepository saleRepository;
    private final StockRepository stockRepository;
    private final InvoiceRepository invoiceRepository;

    public SaleService(
            SaleRepository saleRepository,
            StockRepository stockRepository,
            InvoiceRepository invoiceRepository) {

        this.saleRepository = saleRepository;
        this.stockRepository = stockRepository;
        this.invoiceRepository = invoiceRepository;
    }

    // =========================================================
    // CREATE SALE
    // =========================================================

    @Transactional
    public Sale saveSale(Sale sale) {

        validateSale(sale);

        Stock stock = findStockByMedicineName(
                sale.getMedicineName()
        );

        if (stock == null) {
            throw new RuntimeException(
                    "Medicine not found in stock"
            );
        }

        // Check available stock
        if (stock.getQuantity() < sale.getQuantity()) {
            throw new RuntimeException(
                    "Not enough stock available"
            );
        }

        // Reduce stock
        stock.setQuantity(
                stock.getQuantity() - sale.getQuantity()
        );

        stockRepository.save(stock);

        // Save sale
        Sale savedSale = saleRepository.save(sale);

        // =====================================================
        // CREATE INVOICE AUTOMATICALLY
        // =====================================================

        Invoice invoice = new Invoice();

        invoice.setSaleId(savedSale.getId());

        invoice.setMedicineName(
                savedSale.getMedicineName()
        );

        invoice.setQuantity(
                savedSale.getQuantity()
        );

        invoice.setTotalAmount(
                savedSale.getTotalPrice()
        );

        invoice.setDate(
                savedSale.getDate()
        );

        invoiceRepository.save(invoice);

        return savedSale;
    }

    // =========================================================
    // READ ALL SALES
    // =========================================================

    public List<Sale> getAllSales() {

        return saleRepository.findAll();
    }

    // =========================================================
    // READ ONE SALE
    // =========================================================

    public Sale getSaleById(Long id) {

        return saleRepository
                .findById(id)
                .orElse(null);
    }

    // =========================================================
    // UPDATE SALE
    // =========================================================

    @Transactional
    public Sale updateSale(Long id, Sale sale) {

        validateSale(sale);

        Sale existingSale =
                saleRepository.findById(id).orElse(null);

        if (existingSale == null) {
            return null;
        }

        // =====================================================
        // STEP 1: RETURN OLD QUANTITY TO OLD STOCK
        // =====================================================

        Stock oldStock = findStockByMedicineName(
                existingSale.getMedicineName()
        );

        if (oldStock != null) {

            oldStock.setQuantity(
                    oldStock.getQuantity()
                            + existingSale.getQuantity()
            );

            stockRepository.save(oldStock);
        }

        // =====================================================
        // STEP 2: FIND STOCK FOR NEW SALE
        // =====================================================

        Stock newStock = findStockByMedicineName(
                sale.getMedicineName()
        );

        if (newStock == null) {

            throw new RuntimeException(
                    "Medicine not found in stock"
            );
        }

        // =====================================================
        // STEP 3: CHECK NEW STOCK
        // =====================================================

        if (newStock.getQuantity() < sale.getQuantity()) {

            throw new RuntimeException(
                    "Not enough stock available"
            );
        }

        // =====================================================
        // STEP 4: REDUCE NEW STOCK
        // =====================================================

        newStock.setQuantity(
                newStock.getQuantity()
                        - sale.getQuantity()
        );

        stockRepository.save(newStock);

        // =====================================================
        // STEP 5: UPDATE SALE
        // =====================================================

        existingSale.setMedicineName(
                sale.getMedicineName()
        );

        existingSale.setQuantity(
                sale.getQuantity()
        );

        existingSale.setTotalPrice(
                sale.getTotalPrice()
        );

        existingSale.setDate(
                sale.getDate()
        );

        Sale updatedSale =
                saleRepository.save(existingSale);

        // =====================================================
        // STEP 6: UPDATE RELATED INVOICE
        // =====================================================

        Invoice invoice =
                invoiceRepository
                        .findBySaleId(id)
                        .orElse(null);

        if (invoice != null) {

            invoice.setMedicineName(
                    updatedSale.getMedicineName()
            );

            invoice.setQuantity(
                    updatedSale.getQuantity()
            );

            invoice.setTotalAmount(
                    updatedSale.getTotalPrice()
            );

            invoice.setDate(
                    updatedSale.getDate()
            );

            invoiceRepository.save(invoice);
        }

        return updatedSale;
    }

    // =========================================================
    // DELETE SALE
    // =========================================================

    @Transactional
    public void deleteSale(Long id) {

        Sale existingSale =
                saleRepository.findById(id).orElse(null);

        if (existingSale == null) {
            throw new RuntimeException(
                    "Sale not found"
            );
        }

        // =====================================================
        // STEP 1: RETURN SOLD QUANTITY TO STOCK
        // =====================================================

        Stock stock = findStockByMedicineName(
                existingSale.getMedicineName()
        );

        if (stock != null) {

            stock.setQuantity(
                    stock.getQuantity()
                            + existingSale.getQuantity()
            );

            stockRepository.save(stock);
        }

        // =====================================================
        // STEP 2: DELETE RELATED INVOICE
        // =====================================================

        Invoice invoice =
                invoiceRepository
                        .findBySaleId(id)
                        .orElse(null);

        if (invoice != null) {
            invoiceRepository.delete(invoice);
        }

        // =====================================================
        // STEP 3: DELETE SALE
        // =====================================================

        saleRepository.deleteById(id);
    }

    // =========================================================
    // FIND STOCK BY MEDICINE NAME
    // =========================================================

    private Stock findStockByMedicineName(String medicineName) {

        if (medicineName == null || medicineName.isBlank()) {
            return null;
        }

        List<Stock> stocks = stockRepository.findAll();

        for (Stock stock : stocks) {

            if (stock.getMedicineName() != null
                    && stock.getMedicineName()
                    .equalsIgnoreCase(medicineName.trim())) {

                return stock;
            }
        }

        return null;
    }

    // =========================================================
    // SALE VALIDATION
    // =========================================================

    private void validateSale(Sale sale) {

        if (sale == null) {
            throw new IllegalArgumentException(
                    "Sale data is required"
            );
        }

        if (sale.getMedicineName() == null
                || sale.getMedicineName().isBlank()) {

            throw new IllegalArgumentException(
                    "Medicine name is required"
            );
        }

        if (sale.getQuantity() <= 0) {

            throw new IllegalArgumentException(
                    "Quantity must be greater than 0"
            );
        }

        if (sale.getTotalPrice() <= 0) {

            throw new IllegalArgumentException(
                    "Total price must be greater than 0"
            );
        }

        if (sale.getDate() == null
                || sale.getDate().isBlank()) {

            throw new IllegalArgumentException(
                    "Sale date is required"
            );
        }
    }
}