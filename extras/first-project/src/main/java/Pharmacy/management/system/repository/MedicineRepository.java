package Pharmacy.management.system.repository;

import Pharmacy.management.system.entity.Medicine;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MedicineRepository extends JpaRepository<Medicine, Long> {
}