package Pharmacy.management.system.service;

import Pharmacy.management.system.entity.Stock;
import Pharmacy.management.system.repository.StockRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StockService {

    private final StockRepository stockRepository;

    private final NotificationService notificationService;


    public StockService(
            StockRepository stockRepository,
            NotificationService notificationService
    ) {

        this.stockRepository =
                stockRepository;

        this.notificationService =
                notificationService;
    }


    // =========================================================
    // CREATE
    // =========================================================

    public Stock createStock(
            Stock stock
    ) {

        validateStock(stock);


        Stock savedStock =
                stockRepository.save(stock);


        /*
         * Check stock level immediately after
         * creating the stock.
         *
         * If:
         *
         * quantity <= minimumQuantity
         *
         * a notification will be created.
         */

        notificationService
                .updateStockNotification(
                        savedStock
                );


        return savedStock;
    }


    // =========================================================
    // READ ALL
    // =========================================================

    public List<Stock> getAllStock() {

        return stockRepository.findAll();
    }


    // =========================================================
    // READ ONE
    // =========================================================

    public Stock getStockById(
            Long id
    ) {

        return stockRepository
                .findById(id)
                .orElse(null);
    }


    // =========================================================
    // UPDATE
    // =========================================================

    public Stock updateStock(
            Long id,
            Stock stock
    ) {

        Stock existingStock =
                stockRepository
                        .findById(id)
                        .orElse(null);


        if (existingStock == null) {

            return null;
        }


        validateStock(stock);


        existingStock.setMedicineName(
                stock.getMedicineName()
        );


        existingStock.setQuantity(
                stock.getQuantity()
        );


        existingStock.setMinimumQuantity(
                stock.getMinimumQuantity()
        );


        existingStock.setExpiryDate(
                stock.getExpiryDate()
        );


        Stock updatedStock =
                stockRepository.save(
                        existingStock
                );


        /*
         * Update notification after stock update.
         *
         * LOW:
         * quantity <= minimumQuantity
         * -> create/update notification
         *
         * SUFFICIENT:
         * quantity > minimumQuantity
         * -> deactivate notification
         */

        notificationService
                .updateStockNotification(
                        updatedStock
                );


        return updatedStock;
    }


    // =========================================================
    // DELETE
    // =========================================================

    public void deleteStock(
            Long id
    ) {

        if (
                !stockRepository.existsById(id)
        ) {

            throw new IllegalArgumentException(
                    "Stock not found"
            );
        }


        /*
         * Remove the notification belonging
         * to this stock before deleting it.
         */

        notificationService
                .deactivateNotification(
                        id
                );


        stockRepository.deleteById(
                id
        );
    }


    // =========================================================
    // LOW STOCK
    // =========================================================

    public List<Stock> getLowStock() {

        return stockRepository
                .findLowStock();
    }


    // =========================================================
    // VALIDATION
    // =========================================================

    private void validateStock(
            Stock stock
    ) {

        if (stock == null) {

            throw new IllegalArgumentException(
                    "Stock data is required"
            );
        }


        if (
                stock.getMedicineName() == null
                        || stock.getMedicineName().isBlank()
        ) {

            throw new IllegalArgumentException(
                    "Medicine name is required"
            );
        }


        if (
                stock.getQuantity() < 0
        ) {

            throw new IllegalArgumentException(
                    "Quantity cannot be negative"
            );
        }


        if (
                stock.getMinimumQuantity() < 0
        ) {

            throw new IllegalArgumentException(
                    "Minimum quantity cannot be negative"
            );
        }


        if (
                stock.getExpiryDate() == null
                        || stock.getExpiryDate().isBlank()
        ) {

            throw new IllegalArgumentException(
                    "Expiry date is required"
            );
        }
    }
}