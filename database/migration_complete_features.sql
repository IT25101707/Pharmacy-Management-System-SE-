USE pharmacy_management;

DROP PROCEDURE IF EXISTS add_column_if_missing;
DELIMITER $$
CREATE PROCEDURE add_column_if_missing(IN table_name_value VARCHAR(64), IN column_name_value VARCHAR(64), IN definition_value VARCHAR(255))
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = table_name_value
      AND COLUMN_NAME = column_name_value
  ) THEN
    SET @alter_sql = CONCAT('ALTER TABLE `', table_name_value, '` ADD COLUMN `', column_name_value, '` ', definition_value);
    PREPARE alter_statement FROM @alter_sql;
    EXECUTE alter_statement;
    DEALLOCATE PREPARE alter_statement;
  END IF;
END$$
DELIMITER ;

CALL add_column_if_missing('medicines','controlled','BOOLEAN DEFAULT FALSE');
CALL add_column_if_missing('customers','allergies','VARCHAR(500)');
CALL add_column_if_missing('purchase_orders','expected_delivery','DATE');
CALL add_column_if_missing('purchase_orders','delivery_status','VARCHAR(40) DEFAULT ''AWAITING''');
CALL add_column_if_missing('sales','cancellation_reason','VARCHAR(255)');
DROP PROCEDURE add_column_if_missing;

CREATE TABLE IF NOT EXISTS stock_transfers(
 id INT AUTO_INCREMENT PRIMARY KEY, medicine_id INT NOT NULL, from_branch_id INT NOT NULL, to_branch_id INT NOT NULL,
 quantity INT NOT NULL, status ENUM('PENDING','COMPLETED','CANCELLED') DEFAULT 'PENDING', requested_by INT,
 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, completed_at TIMESTAMP NULL,
 FOREIGN KEY(medicine_id) REFERENCES medicines(id), FOREIGN KEY(from_branch_id) REFERENCES branches(id),
 FOREIGN KEY(to_branch_id) REFERENCES branches(id), FOREIGN KEY(requested_by) REFERENCES users(id)
);
CREATE TABLE IF NOT EXISTS supplier_quotes(
 id INT AUTO_INCREMENT PRIMARY KEY, supplier_id INT NOT NULL, medicine_id INT NOT NULL, unit_price DECIMAL(10,2) NOT NULL,
 lead_days INT DEFAULT 0, notes VARCHAR(255), updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
 UNIQUE KEY uq_supplier_medicine(supplier_id,medicine_id), FOREIGN KEY(supplier_id) REFERENCES suppliers(id),
 FOREIGN KEY(medicine_id) REFERENCES medicines(id)
);
CREATE TABLE IF NOT EXISTS staff_schedules(
 id INT AUTO_INCREMENT PRIMARY KEY, user_id INT NOT NULL, branch_id INT NOT NULL, shift_date DATE NOT NULL,
 start_time TIME NOT NULL, end_time TIME NOT NULL, note VARCHAR(255),
 FOREIGN KEY(user_id) REFERENCES users(id), FOREIGN KEY(branch_id) REFERENCES branches(id)
);
CREATE TABLE IF NOT EXISTS loyalty_transactions(
 id INT AUTO_INCREMENT PRIMARY KEY, customer_id INT NOT NULL, sale_id INT, points INT NOT NULL,
 type ENUM('EARN','REDEEM','ADJUST') NOT NULL, note VARCHAR(255), created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 FOREIGN KEY(customer_id) REFERENCES customers(id), FOREIGN KEY(sale_id) REFERENCES sales(id)
);
CREATE TABLE IF NOT EXISTS customer_reminders(
 id INT AUTO_INCREMENT PRIMARY KEY, customer_id INT NOT NULL, type ENUM('REFILL','LOYALTY','PAYMENT','GENERAL') NOT NULL,
 message VARCHAR(255) NOT NULL, due_date DATE, status ENUM('PENDING','SENT','DONE') DEFAULT 'PENDING',
 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY(customer_id) REFERENCES customers(id)
);
CREATE TABLE IF NOT EXISTS medicine_interactions(
 id INT AUTO_INCREMENT PRIMARY KEY, medicine_a_id INT NOT NULL, medicine_b_id INT NOT NULL, severity VARCHAR(30) DEFAULT 'WARNING',
 warning VARCHAR(255) NOT NULL, UNIQUE KEY uq_interaction(medicine_a_id,medicine_b_id),
 FOREIGN KEY(medicine_a_id) REFERENCES medicines(id), FOREIGN KEY(medicine_b_id) REFERENCES medicines(id)
);
