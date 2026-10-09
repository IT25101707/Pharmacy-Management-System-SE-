DROP DATABASE IF EXISTS pharmacy_management;
CREATE DATABASE pharmacy_management CHARACTER SET utf8mb4;
USE pharmacy_management;

CREATE TABLE branches(
 id INT AUTO_INCREMENT PRIMARY KEY,name VARCHAR(120) NOT NULL,address VARCHAR(255),phone VARCHAR(30),active BOOLEAN DEFAULT TRUE
);
CREATE TABLE roles(id INT AUTO_INCREMENT PRIMARY KEY,name VARCHAR(40) UNIQUE NOT NULL);
CREATE TABLE users(
 id INT AUTO_INCREMENT PRIMARY KEY,full_name VARCHAR(120) NOT NULL,email VARCHAR(160) UNIQUE NOT NULL,
 password_hash VARCHAR(255) NOT NULL,profile_image MEDIUMTEXT,role_id INT NOT NULL,branch_id INT,customer_id INT UNIQUE,status ENUM('ACTIVE','INACTIVE') DEFAULT 'ACTIVE',
 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 FOREIGN KEY(role_id) REFERENCES roles(id),FOREIGN KEY(branch_id) REFERENCES branches(id)
);
CREATE TABLE medicines(
 id INT AUTO_INCREMENT PRIMARY KEY,name VARCHAR(160) NOT NULL,generic_name VARCHAR(160),category VARCHAR(100),
 barcode VARCHAR(80) UNIQUE,unit_price DECIMAL(10,2) DEFAULT 0,reorder_level INT DEFAULT 10,active BOOLEAN DEFAULT TRUE,
 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE stock_batches(
 id INT AUTO_INCREMENT PRIMARY KEY,medicine_id INT NOT NULL,branch_id INT NOT NULL,batch_no VARCHAR(80) NOT NULL,
 quantity INT DEFAULT 0,purchase_price DECIMAL(10,2) DEFAULT 0,expiry_date DATE NOT NULL,
 FOREIGN KEY(medicine_id) REFERENCES medicines(id),FOREIGN KEY(branch_id) REFERENCES branches(id)
);
CREATE TABLE suppliers(
 id INT AUTO_INCREMENT PRIMARY KEY,name VARCHAR(160) NOT NULL,contact_person VARCHAR(120),phone VARCHAR(30),
 email VARCHAR(160),address VARCHAR(255),active BOOLEAN DEFAULT TRUE,created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE purchase_orders(
 id INT AUTO_INCREMENT PRIMARY KEY,po_no VARCHAR(50) UNIQUE NOT NULL,supplier_id INT NOT NULL,branch_id INT NOT NULL,
 status ENUM('PENDING','RECEIVED','CANCELLED') DEFAULT 'PENDING',total_amount DECIMAL(12,2) DEFAULT 0,
 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 FOREIGN KEY(supplier_id) REFERENCES suppliers(id),FOREIGN KEY(branch_id) REFERENCES branches(id)
);
CREATE TABLE customers(
 id INT AUTO_INCREMENT PRIMARY KEY,full_name VARCHAR(120) NOT NULL,phone VARCHAR(30),email VARCHAR(160),address VARCHAR(255),
 loyalty_points INT DEFAULT 0,created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE complaints(
 id INT AUTO_INCREMENT PRIMARY KEY,customer_id INT NOT NULL,subject VARCHAR(160) NOT NULL,details TEXT,
 status ENUM('OPEN','IN_PROGRESS','RESOLVED') DEFAULT 'OPEN',created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 FOREIGN KEY(customer_id) REFERENCES customers(id)
);
CREATE TABLE prescriptions(
 id INT AUTO_INCREMENT PRIMARY KEY,customer_id INT NOT NULL,doctor_name VARCHAR(120),pharmacist_id INT,notes TEXT,
 status ENUM('PENDING','VERIFIED','DISPENSED','VOID') DEFAULT 'PENDING',created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 FOREIGN KEY(customer_id) REFERENCES customers(id),FOREIGN KEY(pharmacist_id) REFERENCES users(id)
);
CREATE TABLE sales(
 id INT AUTO_INCREMENT PRIMARY KEY,invoice_no VARCHAR(50) UNIQUE NOT NULL,customer_id INT,branch_id INT NOT NULL,cashier_id INT NOT NULL,
 subtotal DECIMAL(12,2) DEFAULT 0,discount DECIMAL(12,2) DEFAULT 0,tax DECIMAL(12,2) DEFAULT 0,
 grand_total DECIMAL(12,2) DEFAULT 0,payment_method ENUM('CASH','CARD','DIGITAL') DEFAULT 'CASH',
 status ENUM('PAID','CANCELLED') DEFAULT 'PAID',created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 FOREIGN KEY(customer_id) REFERENCES customers(id),FOREIGN KEY(branch_id) REFERENCES branches(id),FOREIGN KEY(cashier_id) REFERENCES users(id)
);
CREATE TABLE sale_items(
 id INT AUTO_INCREMENT PRIMARY KEY,sale_id INT NOT NULL,medicine_id INT NOT NULL,quantity INT NOT NULL,unit_price DECIMAL(10,2) NOT NULL,
 FOREIGN KEY(sale_id) REFERENCES sales(id) ON DELETE CASCADE,FOREIGN KEY(medicine_id) REFERENCES medicines(id)
);
CREATE TABLE supplier_payments(
 id INT AUTO_INCREMENT PRIMARY KEY,supplier_id INT NOT NULL,amount DECIMAL(12,2) NOT NULL,payment_date DATE NOT NULL,
 method VARCHAR(40),note VARCHAR(255),created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,FOREIGN KEY(supplier_id) REFERENCES suppliers(id)
);

INSERT INTO roles(name) VALUES ('MANAGER'),('PHARMACIST'),('INVENTORY'),('FINANCE'),('CASHIER'),('CUSTOMER');
INSERT INTO branches(name,address,phone) VALUES ('Colombo Main','Colombo 03','0112345678'),('Malabe Branch','Malabe','0112888888');
INSERT INTO medicines(name,generic_name,category,barcode,unit_price,reorder_level) VALUES
('Panadol 500mg','Paracetamol','Pain Relief','10001',18,50),
('Amoxicillin 500mg','Amoxicillin','Antibiotic','10002',42,30),
('Vitamin C 500mg','Ascorbic Acid','Supplement','10003',25,40),
('Cetirizine 10mg','Cetirizine','Allergy','10004',15,25);
INSERT INTO stock_batches(medicine_id,branch_id,batch_no,quantity,purchase_price,expiry_date) VALUES
(1,1,'PND-A1',140,12,DATE_ADD(CURDATE(),INTERVAL 200 DAY)),
(2,1,'AMX-B2',24,30,DATE_ADD(CURDATE(),INTERVAL 70 DAY)),
(3,1,'VTC-C3',90,17,DATE_ADD(CURDATE(),INTERVAL 320 DAY)),
(4,1,'CTZ-D4',18,9,DATE_ADD(CURDATE(),INTERVAL 45 DAY));
INSERT INTO suppliers(name,contact_person,phone,email) VALUES
('MediSource Lanka','Tharindu Silva','0771111111','sales@medisource.lk'),
('Careline Distributors','Rashmi Perera','0772222222','orders@careline.lk');
INSERT INTO customers(full_name,phone,email,loyalty_points) VALUES
('Kavindu Fernando','0711111111','kavindu@example.com',180),
('Nethmi Silva','0722222222','nethmi@example.com',75);

ALTER TABLE users ADD CONSTRAINT fk_users_customer FOREIGN KEY(customer_id) REFERENCES customers(id);

CREATE TABLE IF NOT EXISTS audit_logs(
 id INT AUTO_INCREMENT PRIMARY KEY,user_id INT,action VARCHAR(100) NOT NULL,entity VARCHAR(100),entity_id INT,details VARCHAR(255),created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 FOREIGN KEY(user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS purchase_order_items(
 id INT AUTO_INCREMENT PRIMARY KEY,purchase_order_id INT NOT NULL,medicine_id INT NOT NULL,quantity INT NOT NULL,unit_cost DECIMAL(10,2) NOT NULL,
 FOREIGN KEY(purchase_order_id) REFERENCES purchase_orders(id) ON DELETE CASCADE,FOREIGN KEY(medicine_id) REFERENCES medicines(id)
);
CREATE TABLE IF NOT EXISTS prescription_items(
 id INT AUTO_INCREMENT PRIMARY KEY,prescription_id INT NOT NULL,medicine_id INT NOT NULL,dosage VARCHAR(100),frequency VARCHAR(100),duration VARCHAR(100),quantity INT DEFAULT 1,
 FOREIGN KEY(prescription_id) REFERENCES prescriptions(id) ON DELETE CASCADE,FOREIGN KEY(medicine_id) REFERENCES medicines(id)
);

ALTER TABLE medicines ADD COLUMN controlled BOOLEAN DEFAULT FALSE;
ALTER TABLE customers ADD COLUMN allergies VARCHAR(500);
ALTER TABLE purchase_orders ADD COLUMN expected_delivery DATE, ADD COLUMN delivery_status VARCHAR(40) DEFAULT 'AWAITING';
ALTER TABLE sales ADD COLUMN cancellation_reason VARCHAR(255);

CREATE TABLE stock_transfers(id INT AUTO_INCREMENT PRIMARY KEY,medicine_id INT NOT NULL,from_branch_id INT NOT NULL,to_branch_id INT NOT NULL,quantity INT NOT NULL,status ENUM('PENDING','COMPLETED','CANCELLED') DEFAULT 'PENDING',requested_by INT,created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,completed_at TIMESTAMP NULL,FOREIGN KEY(medicine_id) REFERENCES medicines(id),FOREIGN KEY(from_branch_id) REFERENCES branches(id),FOREIGN KEY(to_branch_id) REFERENCES branches(id),FOREIGN KEY(requested_by) REFERENCES users(id));
CREATE TABLE supplier_quotes(id INT AUTO_INCREMENT PRIMARY KEY,supplier_id INT NOT NULL,medicine_id INT NOT NULL,unit_price DECIMAL(10,2) NOT NULL,lead_days INT DEFAULT 0,notes VARCHAR(255),updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,UNIQUE KEY uq_supplier_medicine(supplier_id,medicine_id),FOREIGN KEY(supplier_id) REFERENCES suppliers(id),FOREIGN KEY(medicine_id) REFERENCES medicines(id));
CREATE TABLE staff_schedules(id INT AUTO_INCREMENT PRIMARY KEY,user_id INT NOT NULL,branch_id INT NOT NULL,shift_date DATE NOT NULL,start_time TIME NOT NULL,end_time TIME NOT NULL,note VARCHAR(255),FOREIGN KEY(user_id) REFERENCES users(id),FOREIGN KEY(branch_id) REFERENCES branches(id));
CREATE TABLE loyalty_transactions(id INT AUTO_INCREMENT PRIMARY KEY,customer_id INT NOT NULL,sale_id INT,points INT NOT NULL,type ENUM('EARN','REDEEM','ADJUST') NOT NULL,note VARCHAR(255),created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,FOREIGN KEY(customer_id) REFERENCES customers(id),FOREIGN KEY(sale_id) REFERENCES sales(id));
CREATE TABLE customer_reminders(id INT AUTO_INCREMENT PRIMARY KEY,customer_id INT NOT NULL,type ENUM('REFILL','LOYALTY','PAYMENT','GENERAL') NOT NULL,message VARCHAR(255) NOT NULL,due_date DATE,status ENUM('PENDING','SENT','DONE') DEFAULT 'PENDING',created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,FOREIGN KEY(customer_id) REFERENCES customers(id));
CREATE TABLE medicine_interactions(id INT AUTO_INCREMENT PRIMARY KEY,medicine_a_id INT NOT NULL,medicine_b_id INT NOT NULL,severity VARCHAR(30) DEFAULT 'WARNING',warning VARCHAR(255) NOT NULL,UNIQUE KEY uq_interaction(medicine_a_id,medicine_b_id),FOREIGN KEY(medicine_a_id) REFERENCES medicines(id),FOREIGN KEY(medicine_b_id) REFERENCES medicines(id));

-- MERGED FEATURES: invoice CRUD + persistent notification records
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
