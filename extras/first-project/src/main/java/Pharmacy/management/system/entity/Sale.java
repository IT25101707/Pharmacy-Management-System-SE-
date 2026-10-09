package Pharmacy.management.system.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "sales")
public class Sale {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String medicineName;
    private int quantity;
    private double totalPrice;
    private String date;

    public Sale() {
    }

    public Sale(String medicineName, int quantity, double totalPrice, String date) {
        this.medicineName = medicineName;
        this.quantity = quantity;
        this.totalPrice = totalPrice;
        this.date = date;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getMedicineName() { return medicineName; }
    public void setMedicineName(String medicineName) { this.medicineName = medicineName; }
    public int getQuantity() { return quantity; }
    public void setQuantity(int quantity) { this.quantity = quantity; }
    public double getTotalPrice() { return totalPrice; }
    public void setTotalPrice(double totalPrice) { this.totalPrice = totalPrice; }
    public String getDate() { return date; }
    public void setDate(String date) { this.date = date; }
}
