-- Run this once in MySQL before starting the updated application.
-- It replaces the obsolete CUSTOMER_SERVICE role with SALES_OFFICER.
UPDATE users
SET role = 'SALES_OFFICER'
WHERE role = 'CUSTOMER_SERVICE';

-- Verify the final roles.
SELECT id, name, username, role
FROM users
ORDER BY id;
