USE pharmacy_management;
INSERT IGNORE INTO roles(name) VALUES ('CUSTOMER');
SET @has_customer_id = (SELECT COUNT(*) FROM information_schema.COLUMNS WHERE TABLE_SCHEMA=DATABASE() AND TABLE_NAME='users' AND COLUMN_NAME='customer_id');
SET @sql = IF(@has_customer_id=0,'ALTER TABLE users ADD COLUMN customer_id INT NULL UNIQUE AFTER branch_id','SELECT 1');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;
SET @has_customer_fk = (SELECT COUNT(*) FROM information_schema.TABLE_CONSTRAINTS WHERE CONSTRAINT_SCHEMA=DATABASE() AND TABLE_NAME='users' AND CONSTRAINT_NAME='fk_users_customer');
SET @sql = IF(@has_customer_fk=0,'ALTER TABLE users ADD CONSTRAINT fk_users_customer FOREIGN KEY (customer_id) REFERENCES customers(id)','SELECT 1');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;
