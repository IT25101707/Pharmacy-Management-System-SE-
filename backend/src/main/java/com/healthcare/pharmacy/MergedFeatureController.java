package com.healthcare.pharmacy;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api")
public class MergedFeatureController {
    private final JdbcTemplate db;
    private final ApiController api;

    public MergedFeatureController(JdbcTemplate db, ApiController api) {
        this.db = db;
        this.api = api;
    }

    @GetMapping("/invoices")
    Object invoices(HttpServletRequest r) {
        api.allow(r, List.of("MANAGER", "FINANCE", "CASHIER", "PHARMACIST"));
        return db.queryForList("SELECT i.*, s.invoice_no, s.payment_method, s.grand_total AS sale_total FROM invoices i LEFT JOIN sales s ON s.id=i.sale_id ORDER BY i.id DESC");
    }

    @GetMapping("/invoices/{id}")
    Object invoice(@PathVariable long id, HttpServletRequest r) {
        api.allow(r, List.of("MANAGER", "FINANCE", "CASHIER", "PHARMACIST"));
        List<Map<String,Object>> rows = db.queryForList("SELECT i.*, s.invoice_no, s.payment_method, s.grand_total AS sale_total FROM invoices i LEFT JOIN sales s ON s.id=i.sale_id WHERE i.id=?", id);
        if (rows.isEmpty()) throw new ApiController.ApiException(HttpStatus.NOT_FOUND, "Invoice not found");
        return rows.get(0);
    }

    @PostMapping("/invoices")
    ResponseEntity<?> createInvoice(@RequestBody Map<String,Object> b, HttpServletRequest r) {
        api.allow(r, List.of("MANAGER", "FINANCE"));
        Number n = db.queryForObject("SELECT COUNT(*) FROM sales WHERE id=?", Number.class, b.get("saleId"));
        if (n == null || n.intValue()==0) throw new ApiController.ApiException(HttpStatus.BAD_REQUEST, "Sale ID does not exist");
        int rows = db.update("INSERT INTO invoices(sale_id,medicine_name,quantity,total_amount,date) VALUES(?,?,?,?,?)",
                b.get("saleId"), b.get("medicineName"), b.get("quantity"), b.get("totalAmount"), b.get("date"));
        return ResponseEntity.status(201).body(Map.of("message","Invoice created","rows",rows));
    }

    @PutMapping("/invoices/{id}")
    Object updateInvoice(@PathVariable long id, @RequestBody Map<String,Object> b, HttpServletRequest r) {
        api.allow(r, List.of("MANAGER", "FINANCE"));
        int n = db.update("UPDATE invoices SET sale_id=?,medicine_name=?,quantity=?,total_amount=?,date=? WHERE id=?",
                b.get("saleId"), b.get("medicineName"), b.get("quantity"), b.get("totalAmount"), b.get("date"), id);
        if (n==0) throw new ApiController.ApiException(HttpStatus.NOT_FOUND,"Invoice not found");
        return Map.of("message","Invoice updated");
    }

    @DeleteMapping("/invoices/{id}")
    Object deleteInvoice(@PathVariable long id, HttpServletRequest r) {
        api.allow(r, List.of("MANAGER", "FINANCE"));
        int n = db.update("DELETE FROM invoices WHERE id=?", id);
        if (n==0) throw new ApiController.ApiException(HttpStatus.NOT_FOUND,"Invoice not found");
        return Map.of("message","Invoice deleted");
    }

    @GetMapping("/stock-batches")
    Object stockBatches(HttpServletRequest r) {
        api.allow(r, List.of("MANAGER", "INVENTORY", "PHARMACIST"));
        return db.queryForList("SELECT sb.*, m.name medicine_name, b.name branch_name FROM stock_batches sb JOIN medicines m ON m.id=sb.medicine_id JOIN branches b ON b.id=sb.branch_id ORDER BY sb.id DESC");
    }

    @PostMapping("/stock-batches")
    ResponseEntity<?> createStockBatch(@RequestBody Map<String,Object> b, HttpServletRequest r) {
        api.allow(r, List.of("MANAGER", "INVENTORY"));
        int n = db.update("INSERT INTO stock_batches(medicine_id,branch_id,batch_no,quantity,purchase_price,expiry_date) VALUES(?,?,?,?,?,?)", b.get("medicine_id"), b.get("branch_id"), b.get("batch_no"), b.get("quantity"), b.getOrDefault("purchase_price",0), b.get("expiry_date"));
        return ResponseEntity.status(201).body(Map.of("message","Stock batch created","rows",n));
    }

    @PutMapping("/stock-batches/{id}")
    Object updateStockBatch(@PathVariable long id, @RequestBody Map<String,Object> b, HttpServletRequest r) {
        api.allow(r, List.of("MANAGER", "INVENTORY"));
        int n = db.update("UPDATE stock_batches SET medicine_id=?,branch_id=?,batch_no=?,quantity=?,purchase_price=?,expiry_date=? WHERE id=?", b.get("medicine_id"), b.get("branch_id"), b.get("batch_no"), b.get("quantity"), b.getOrDefault("purchase_price",0), b.get("expiry_date"), id);
        if (n==0) throw new ApiController.ApiException(HttpStatus.NOT_FOUND,"Stock batch not found");
        return Map.of("message","Stock batch updated");
    }

    @DeleteMapping("/stock-batches/{id}")
    Object deleteStockBatch(@PathVariable long id, HttpServletRequest r) {
        api.allow(r, List.of("MANAGER", "INVENTORY"));
        int n = db.update("DELETE FROM stock_batches WHERE id=?", id);
        if (n==0) throw new ApiController.ApiException(HttpStatus.NOT_FOUND,"Stock batch not found");
        return Map.of("message","Stock batch deleted");
    }

    @GetMapping("/notifications/count")
    Object notificationCount(HttpServletRequest r) {
        api.allow(r, List.of("MANAGER", "INVENTORY", "FINANCE", "CASHIER", "PHARMACIST"));
        Number low = db.queryForObject("SELECT COUNT(*) FROM (SELECT m.id FROM medicines m LEFT JOIN stock_batches b ON b.medicine_id=m.id WHERE m.active=1 GROUP BY m.id,m.reorder_level HAVING COALESCE(SUM(b.quantity),0)<=m.reorder_level)x", Number.class);
        Number expiry = db.queryForObject("SELECT COUNT(*) FROM stock_batches WHERE quantity>0 AND expiry_date BETWEEN CURDATE() AND DATE_ADD(CURDATE(),INTERVAL 90 DAY)", Number.class);
        return (low==null?0:low.intValue()) + (expiry==null?0:expiry.intValue());
    }

}
