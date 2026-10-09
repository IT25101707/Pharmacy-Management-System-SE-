package Pharmacy.management.system.service;

import Pharmacy.management.system.entity.Medicine;
import Pharmacy.management.system.repository.MedicineRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MedicineService {

    private final MedicineRepository medicineRepository;

    public MedicineService(MedicineRepository medicineRepository) {
        this.medicineRepository = medicineRepository;
    }

    // CREATE
    public Medicine createMedicine(Medicine medicine) {

        validateMedicine(medicine);

        return medicineRepository.save(medicine);
    }

    // READ ALL
    public List<Medicine> getAllMedicines() {
        return medicineRepository.findAll();
    }

    // READ ONE
    public Medicine getMedicineById(Long id) {
        return medicineRepository
                .findById(id)
                .orElse(null);
    }

    // UPDATE
    public Medicine updateMedicine(
            Long id,
            Medicine medicine) {

        Medicine existingMedicine =
                medicineRepository
                        .findById(id)
                        .orElse(null);

        if (existingMedicine == null) {
            return null;
        }

        validateMedicine(medicine);

        existingMedicine.setName(
                medicine.getName()
        );

        existingMedicine.setCategory(
                medicine.getCategory()
        );

        existingMedicine.setPrice(
                medicine.getPrice()
        );

        existingMedicine.setQuantity(
                medicine.getQuantity()
        );

        return medicineRepository.save(existingMedicine);
    }

    // DELETE
    public void deleteMedicine(Long id) {

        if (!medicineRepository.existsById(id)) {
            throw new IllegalArgumentException(
                    "Medicine not found"
            );
        }

        medicineRepository.deleteById(id);
    }

    // VALIDATION
    private void validateMedicine(Medicine medicine) {

        if (medicine == null) {
            throw new IllegalArgumentException(
                    "Medicine data is required"
            );
        }

        if (medicine.getName() == null
                || medicine.getName().isBlank()) {

            throw new IllegalArgumentException(
                    "Medicine name is required"
            );
        }

        if (medicine.getCategory() == null
                || medicine.getCategory().isBlank()) {

            throw new IllegalArgumentException(
                    "Category is required"
            );
        }

        if (medicine.getPrice() < 0) {
            throw new IllegalArgumentException(
                    "Price cannot be negative"
            );
        }

        if (medicine.getQuantity() < 0) {
            throw new IllegalArgumentException(
                    "Quantity cannot be negative"
            );
        }
    }
}