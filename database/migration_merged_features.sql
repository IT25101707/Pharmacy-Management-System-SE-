-- Run this after the original schema.sql if the database already exists.
USE pharmacy_management;

CREATE TABLE IF NOT EXISTS invoices(
 id INT AUTO_INCREMENT PRIMARY KEY,
 sale_id INT NOT NULL,
 medicine_name VARCHAR(160) NOT NULL,
 quantity INT NOT NULL DEFAULT 1,
 total_amount DECIMAL(12,2) NOT NULL DEFAULT 0,
 date VARCHAR(30) NOT NULL,
 FOREIGN KEY(sale_id) REFERENCES sales(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS notifications(
 id INT AUTO_INCREMENT PRIMARY KEY,
 stock_id INT NOT NULL,
 medicine_name VARCHAR(160) NOT NULL,
 current_quantity INT NOT NULL DEFAULT 0,
 minimum_quantity INT NOT NULL DEFAULT 0,
 message VARCHAR(255) NOT NULL,
 active BOOLEAN NOT NULL DEFAULT TRUE,
 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
