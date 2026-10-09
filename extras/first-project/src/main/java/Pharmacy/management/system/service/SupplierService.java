package Pharmacy.management.system.service;

import Pharmacy.management.system.entity.Supplier;
import Pharmacy.management.system.repository.SupplierRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SupplierService {

    private final SupplierRepository supplierRepository;

    public SupplierService(SupplierRepository supplierRepository) {
        this.supplierRepository = supplierRepository;
    }

    // CREATE
    public Supplier createSupplier(Supplier supplier) {

        validateSupplier(supplier);

        return supplierRepository.save(supplier);
    }

    // READ ALL
    public List<Supplier> getAllSuppliers() {
        return supplierRepository.findAll();
    }

    // READ ONE
    public Supplier getSupplierById(Long id) {
        return supplierRepository
                .findById(id)
                .orElse(null);
    }

    // UPDATE
    public Supplier updateSupplier(
            Long id,
            Supplier supplier) {

        Supplier existingSupplier =
                supplierRepository
                        .findById(id)
                        .orElse(null);

        if (existingSupplier == null) {
            return null;
        }

        validateSupplier(supplier);

        existingSupplier.setName(
                supplier.getName()
        );

        existingSupplier.setContact(
                supplier.getContact()
        );

        existingSupplier.setEmail(
                supplier.getEmail()
        );

        existingSupplier.setAddress(
                supplier.getAddress()
        );

        return supplierRepository.save(existingSupplier);
    }

    // DELETE
    public void deleteSupplier(Long id) {

        if (!supplierRepository.existsById(id)) {
            throw new IllegalArgumentException(
                    "Supplier not found"
            );
        }

        supplierRepository.deleteById(id);
    }

    // VALIDATION
    private void validateSupplier(Supplier supplier) {

        if (supplier == null) {
            throw new IllegalArgumentException(
                    "Supplier data is required"
            );
        }

        if (supplier.getName() == null
                || supplier.getName().isBlank()) {

            throw new IllegalArgumentException(
                    "Supplier name is required"
            );
        }

        if (supplier.getContact() == null
                || supplier.getContact().isBlank()) {

            throw new IllegalArgumentException(
                    "Contact number is required"
            );
        }

        if (supplier.getEmail() == null
                || supplier.getEmail().isBlank()) {

            throw new IllegalArgumentException(
                    "Email is required"
            );
        }

        if (supplier.getAddress() == null
                || supplier.getAddress().isBlank()) {

            throw new IllegalArgumentException(
                    "Address is required"
            );
        }
    }
}