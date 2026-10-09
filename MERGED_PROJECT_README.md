# Pharmacy Management System - Merged Build

This package combines the richer React/Spring Boot pharmacy system with the additional CRUD-oriented project assets.

## Primary runnable project
- `backend/` - Spring Boot API, port 5000
- `frontend/` - React/Vite premium UI
- `database/schema.sql` - complete database schema
- `database/migration_merged_features.sql` - invoice + notification tables for an existing database

## Main CRUD
- Medicines
- Suppliers
- Customers
- Prescriptions
- Sales
- Supplier Payments
- Users
- Stock / stock alerts
- Invoices (added merged CRUD API)

## Additional features retained
- Customer registration and portal
- POS checkout
- Invoice viewing/printing
- Profile image/profile editing
- Low-stock and expiry notifications
- Purchase orders
- Branches
- Reports
- Advanced operations

## Run
1. Import `database/schema.sql` into MySQL Workbench (database: `pharmacy_management`).
2. Check `backend/src/main/resources/application.properties` and set your MySQL password.
3. Start backend from `backend` with `./mvnw spring-boot:run` (Windows: `mvnw.cmd spring-boot:run`).
4. Start frontend from `frontend` with `npm install` then `npm run dev`.
5. Open the Vite URL shown in the terminal.

The `extras/first-project/` directory contains the original CRUD/Thymeleaf project files preserved from the other ZIP for reference and recovery; the primary merged UI is the React application so the richer feature set remains available.
