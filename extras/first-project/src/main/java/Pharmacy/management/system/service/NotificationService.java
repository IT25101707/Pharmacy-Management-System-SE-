package Pharmacy.management.system.service;

import Pharmacy.management.system.entity.Notification;
import Pharmacy.management.system.entity.Stock;
import Pharmacy.management.system.repository.NotificationRepository;
import Pharmacy.management.system.repository.StockRepository;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;

    private final StockRepository stockRepository;


    public NotificationService(
            NotificationRepository notificationRepository,
            StockRepository stockRepository
    ) {

        this.notificationRepository =
                notificationRepository;

        this.stockRepository =
                stockRepository;
    }


    // =========================================================
    // UPDATE ONE STOCK NOTIFICATION
    // =========================================================

    public void updateStockNotification(
            Stock stock
    ) {

        if (
                stock == null
                        || stock.getId() == null
        ) {

            return;
        }


        boolean isLowStock =
                stock.getQuantity()
                        <= stock.getMinimumQuantity();


        // =====================================================
        // LOW STOCK
        // =====================================================

        if (isLowStock) {

            Notification notification =
                    notificationRepository
                            .findByStockIdAndActiveTrue(
                                    stock.getId()
                            )
                            .orElse(null);


            // -------------------------------------------------
            // CREATE
            // -------------------------------------------------

            if (notification == null) {

                notification =
                        new Notification(
                                stock.getId(),
                                stock.getMedicineName(),
                                stock.getQuantity(),
                                stock.getMinimumQuantity(),
                                "Low Stock Alert",
                                true
                        );

            }


            // -------------------------------------------------
            // UPDATE
            // -------------------------------------------------

            else {

                notification.setMedicineName(
                        stock.getMedicineName()
                );

                notification.setCurrentQuantity(
                        stock.getQuantity()
                );

                notification.setMinimumQuantity(
                        stock.getMinimumQuantity()
                );

                notification.setMessage(
                        "Low Stock Alert"
                );

                notification.setActive(
                        true
                );

            }


            notificationRepository.save(
                    notification
            );


            return;
        }


        // =====================================================
        // STOCK IS SUFFICIENT
        // =====================================================

        deactivateNotification(
                stock.getId()
        );
    }


    // =========================================================
    // DEACTIVATE NOTIFICATION
    // =========================================================

    public void deactivateNotification(
            Long stockId
    ) {

        if (stockId == null) {

            return;
        }


        notificationRepository
                .findByStockIdAndActiveTrue(
                        stockId
                )
                .ifPresent(
                        notification -> {

                            notification.setActive(
                                    false
                            );

                            notificationRepository.save(
                                    notification
                            );

                        }
                );
    }


    // =========================================================
    // SYNCHRONIZE ALL STOCK NOTIFICATIONS
    // =========================================================

    public void synchronizeStockNotifications() {

        /*
         * Get ALL current stock records.
         *
         * We don't depend only on old notification records.
         * Current Stock data is the source of truth.
         */

        List<Stock> allStock =
                stockRepository.findAll();


        Set<Long> lowStockIds =
                new HashSet<>();


        // =====================================================
        // CHECK EVERY STOCK
        // =====================================================

        for (Stock stock : allStock) {

            if (stock.getId() == null) {

                continue;
            }


            boolean isLowStock =
                    stock.getQuantity()
                            <= stock.getMinimumQuantity();


            if (isLowStock) {

                lowStockIds.add(
                        stock.getId()
                );


                /*
                 * Create or update notification.
                 */

                updateStockNotification(
                        stock
                );

            }

        }


        // =====================================================
        // REMOVE OLD NOTIFICATIONS
        // =====================================================

        List<Notification> activeNotifications =
                notificationRepository
                        .findByActiveTrueOrderByCreatedAtDesc();


        for (
                Notification notification
                : activeNotifications
        ) {

            Long stockId =
                    notification.getStockId();


            /*
             * If stock is no longer low,
             * remove its active notification.
             */

            if (
                    stockId == null
                            || !lowStockIds.contains(
                            stockId
                    )
            ) {

                notification.setActive(
                        false
                );


                notificationRepository.save(
                        notification
                );

            }

        }

    }


    // =========================================================
    // GET ACTIVE NOTIFICATIONS
    // =========================================================

    public List<Notification>
    getActiveNotifications() {

        /*
         * IMPORTANT:
         *
         * Synchronize BEFORE returning notifications.
         *
         * Therefore the UI always receives
         * the latest stock situation.
         */

        synchronizeStockNotifications();


        return notificationRepository
                .findByActiveTrueOrderByCreatedAtDesc();
    }


    // =========================================================
    // GET ACTIVE NOTIFICATION COUNT
    // =========================================================

    public long getActiveNotificationCount() {

        /*
         * Synchronize before calculating count.
         */

        synchronizeStockNotifications();


        return notificationRepository
                .countByActiveTrue();
    }

}