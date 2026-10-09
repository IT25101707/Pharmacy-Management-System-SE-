package Pharmacy.management.system.repository;

import Pharmacy.management.system.entity.Supplier;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SupplierRepository extends JpaRepository<Supplier, Long> {
}