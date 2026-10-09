package Pharmacy.management.system.service;

import Pharmacy.management.system.entity.Prescription;
import Pharmacy.management.system.repository.PrescriptionRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PrescriptionService {

    private final PrescriptionRepository prescriptionRepository;

    public PrescriptionService(
            PrescriptionRepository prescriptionRepository) {

        this.prescriptionRepository = prescriptionRepository;
    }

    // =====================================================
    // CREATE PRESCRIPTION
    // =====================================================

    public Prescription savePrescription(
            Prescription prescription) {

        validatePrescription(prescription);

        return prescriptionRepository.save(prescription);
    }

    // =====================================================
    // READ ALL PRESCRIPTIONS
    // =====================================================

    public List<Prescription> getAllPrescriptions() {

        return prescriptionRepository.findAll();
    }

    // =====================================================
    // READ ONE PRESCRIPTION
    // =====================================================

    public Prescription getPrescriptionById(Long id) {

        return prescriptionRepository
                .findById(id)
                .orElse(null);
    }

    // =====================================================
    // UPDATE PRESCRIPTION
    // =====================================================

    public Prescription updatePrescription(
            Long id,
            Prescription prescription) {

        Prescription existingPrescription =
                prescriptionRepository
                        .findById(id)
                        .orElse(null);

        if (existingPrescription == null) {

            return null;
        }

        validatePrescription(prescription);

        existingPrescription.setMedicineName(
                prescription.getMedicineName()
        );

        existingPrescription.setDosage(
                prescription.getDosage()
        );

        existingPrescription.setDate(
                prescription.getDate()
        );

        return prescriptionRepository.save(
                existingPrescription
        );
    }

    // =====================================================
    // DELETE PRESCRIPTION
    // =====================================================

    public void deletePrescription(Long id) {

        if (!prescriptionRepository.existsById(id)) {

            throw new IllegalArgumentException(
                    "Prescription not found"
            );
        }

        prescriptionRepository.deleteById(id);
    }

    // =====================================================
    // VALIDATION
    // =====================================================

    private void validatePrescription(
            Prescription prescription) {

        if (prescription == null) {

            throw new IllegalArgumentException(
                    "Prescription data is required"
            );
        }

        if (prescription.getMedicineName() == null
                || prescription.getMedicineName().isBlank()) {

            throw new IllegalArgumentException(
                    "Medicine name is required"
            );
        }

        if (prescription.getDosage() == null
                || prescription.getDosage().isBlank()) {

            throw new IllegalArgumentException(
                    "Dosage is required"
            );
        }

        if (prescription.getDate() == null
                || prescription.getDate().isBlank()) {

            throw new IllegalArgumentException(
                    "Prescription date is required"
            );
        }
    }
}