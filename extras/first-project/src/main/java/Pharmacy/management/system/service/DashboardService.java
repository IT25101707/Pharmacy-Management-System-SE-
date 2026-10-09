package Pharmacy.management.system.service;

import Pharmacy.management.system.entity.Stock;
import Pharmacy.management.system.repository.InvoiceRepository;
import Pharmacy.management.system.repository.MedicineRepository;
import Pharmacy.management.system.repository.PrescriptionRepository;
import Pharmacy.management.system.repository.SaleRepository;
import Pharmacy.management.system.repository.StockRepository;
import Pharmacy.management.system.repository.SupplierRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeParseException;
import java.util.HashMap;
import java.util.Map;

@Service
public class DashboardService {

    private final MedicineRepository medicineRepository;
    private final SupplierRepository supplierRepository;
    private final StockRepository stockRepository;
    private final PrescriptionRepository prescriptionRepository;
    private final SaleRepository saleRepository;
    private final InvoiceRepository invoiceRepository;

    public DashboardService(
            MedicineRepository medicineRepository,
            SupplierRepository supplierRepository,
            StockRepository stockRepository,
            PrescriptionRepository prescriptionRepository,
            SaleRepository saleRepository,
            InvoiceRepository invoiceRepository) {

        this.medicineRepository = medicineRepository;
        this.supplierRepository = supplierRepository;
        this.stockRepository = stockRepository;
        this.prescriptionRepository = prescriptionRepository;
        this.saleRepository = saleRepository;
        this.invoiceRepository = invoiceRepository;
    }

    public Map<String, Object> getDashboardStats() {

        Map<String, Object> stats = new HashMap<>();

        // Total Medicines
        stats.put(
                "medicineCount",
                medicineRepository.count()
        );

        // Total Suppliers
        stats.put(
                "supplierCount",
                supplierRepository.count()
        );

        // Total Stock Items
        stats.put(
                "stockCount",
                stockRepository.count()
        );

        // Low Stock Items
        long lowStockCount =
                stockRepository
                        .findLowStock()
                        .size();

        stats.put(
                "lowStockCount",
                lowStockCount
        );

        // Expiring / Expired Items
        LocalDate today = LocalDate.now();
        LocalDate expiryLimit = today.plusDays(30);

        long expiringCount =
                stockRepository.findAll()
                        .stream()
                        .filter(stock -> {

                            if (stock.getExpiryDate() == null
                                    || stock.getExpiryDate().isBlank()) {
                                return false;
                            }

                            try {
                                LocalDate expiryDate =
                                        LocalDate.parse(
                                                stock.getExpiryDate()
                                        );

                                return !expiryDate.isAfter(
                                        expiryLimit
                                );

                            } catch (DateTimeParseException e) {
                                return false;
                            }
                        })
                        .count();

        stats.put(
                "expiringCount",
                expiringCount
        );

        // Total Prescriptions
        stats.put(
                "prescriptionCount",
                prescriptionRepository.count()
        );

        // Total Sales
        stats.put(
                "salesCount",
                saleRepository.count()
        );

        // Total Invoices
        stats.put(
                "invoiceCount",
                invoiceRepository.count()
        );

        // Total Revenue
        double totalRevenue =
                saleRepository.findAll()
                        .stream()
                        .mapToDouble(
                                sale -> sale.getTotalPrice()
                        )
                        .sum();

        stats.put(
                "totalRevenue",
                totalRevenue
        );

        return stats;
    }
}