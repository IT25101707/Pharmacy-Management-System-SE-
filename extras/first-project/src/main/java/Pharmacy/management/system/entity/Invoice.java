package Pharmacy.management.system.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "invoices")
public class Invoice {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long saleId;
    private String medicineName;
    private int quantity;
    private double totalAmount;
    private String date;

    public Invoice() {
    }

    public Invoice(String medicineName, int quantity, double totalAmount, String date) {
        this.medicineName = medicineName;
        this.quantity = quantity;
        this.totalAmount = totalAmount;
        this.date = date;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getSaleId() { return saleId; }
    public void setSaleId(Long saleId) { this.saleId = saleId; }
    public String getMedicineName() { return medicineName; }
    public void setMedicineName(String medicineName) { this.medicineName = medicineName; }
    public int getQuantity() { return quantity; }
    public void setQuantity(int quantity) { this.quantity = quantity; }
    public double getTotalAmount() { return totalAmount; }
    public void setTotalAmount(double totalAmount) { this.totalAmount = totalAmount; }
    public String getDate() { return date; }
    public void setDate(String date) { this.date = date; }
}
