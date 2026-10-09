# Health Care Pharmacy Management System

This version uses React 18 + Vite, Spring Boot 3 (Java 17), MySQL 8, JWT authentication, and BCrypt password hashing.

## 1. Create the database in MySQL Workbench

1. Connect Workbench to your local MySQL server.
2. Open `database/schema.sql`.
3. Run the complete script using the lightning-bolt button.
4. Refresh **Schemas** and confirm that `pharmacy_management` exists.

## 2. Run the Spring Boot backend

Install Java 17+ and Maven 3.9+. Then set your database credentials.

Windows PowerShell:

```powershell
cd backend
$env:DB_USER="root"
$env:DB_PASSWORD="your_mysql_password"
$env:JWT_SECRET="replace-with-a-long-random-secret-at-least-32-characters"
mvn spring-boot:run
```

macOS/Linux:

```bash
cd backend
export DB_USER=root
export DB_PASSWORD=your_mysql_password
export JWT_SECRET=replace-with-a-long-random-secret-at-least-32-characters
mvn spring-boot:run
```

The API starts at `http://localhost:5000/api`. It creates demo staff accounts on first startup.

## 3. Run the React frontend

In a second terminal:

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173`.

## Updating an existing installation

If you already imported the database before the profile-image feature was added, run this once in MySQL Workbench:

```sql
USE pharmacy_management;
ALTER TABLE users ADD COLUMN profile_image MEDIUMTEXT NULL AFTER password_hash;
```

The same command is available in `database/migration_add_profile_image.sql`. It preserves all existing data.

To add the customer portal to an existing database, run `database/migration_add_customer_role.sql` once in MySQL Workbench. New database installations receive it automatically through `schema.sql`.

## Customer portal

Select **Create Customer Account** on the login screen. A registered customer can sign in to view only their own purchase history, invoices, total spending and loyalty points. Registered-customer invoices include the customer ID, phone, email, points earned and current loyalty balance.

## Complete presentation features

For an existing database, run `database/migration_complete_features.sql` once after the customer-role migration. The **Advanced Operations** page then provides branch stock transfers, supplier price comparison, customer complaint tracking, refill/loyalty reminders, staff schedules, purchase/delivery support and expanded financial reporting. Reports include daily/monthly/yearly sales, inventory value, supplier outstanding balances, medicine movement and expired-stock wastage, with monthly CSV export.

## Demo login

- Email: `manager@healthcare.lk`
- Password: `password`

The pharmacist, inventory, finance, and cashier demo accounts use their role name before `@healthcare.lk`; each initially uses `password`.

## Before production

- Change the JWT secret and all demo passwords.
- Keep database credentials in environment variables.
- Set `CORS_ORIGIN` if React is hosted somewhere other than `http://localhost:5173`.
