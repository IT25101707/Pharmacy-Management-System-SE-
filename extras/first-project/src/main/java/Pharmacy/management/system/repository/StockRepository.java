package Pharmacy.management.system.repository;

import Pharmacy.management.system.entity.Stock;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface StockRepository extends JpaRepository<Stock, Long> {

    @Query("SELECT s FROM Stock s WHERE s.quantity <= s.minimumQuantity")
    List<Stock> findLowStock();
}