# Support Ticket Management API

## Overview
This is a helpdesk backend system built with NestJS, TypeORM, and MySQL.

## Requirements
- Node.js (v18+)
- MySQL server running locally

## Setup Instructions

1. **Clone/Download** the repository and navigate into it:
   ```bash
   cd backend-exam
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Database Setup**:
   - Create a MySQL database named `ticket_management`.
   - Update the `.env` file with your MySQL credentials (if they differ from default).

4. **Environment Variables**:
   ```env
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=root
   DB_PASSWORD=
   DB_NAME=ticket_management
   JWT_SECRET=superSecretKeyForExamProject
   PORT=3000
   ```

5. **Start the application**:
   ```bash
   npm run start:dev
   ```
   *Note: Since `synchronize: true` is enabled in TypeORM, the tables will automatically be created on the first start.*

6. **Seed the database (IMPORTANT)**:
   You need default roles and an initial manager to start testing. You can run the provided SQL script in your MySQL client:
   ```sql
   INSERT INTO roles (name) VALUES ('MANAGER'), ('SUPPORT'), ('USER');
   
   -- Creates a manager with email 'manager@example.com' and password 'password123'
   -- The password hash here matches 'password123'
   INSERT INTO users (name, email, password, role_id) 
   VALUES ('Admin', 'manager@example.com', '$2a$10$wT/tSTK/.uA.P9cGEeT.Gez713E0dIqF6bYjN.B5O7/yv7Ntz3xV2', 1);
   ```
   Or run the provided script `db-seed.sql` in your MySQL management tool.

## API Documentation
The API is documented via Swagger UI. Once the app is running, open your browser and navigate to:
[http://localhost:3000/docs](http://localhost:3000/docs)

From there, you can explore the endpoints, view schemas, and authenticate via a JWT token.

## Roles & Access Control
- **MANAGER**: Can manage users, view all tickets, assign tickets, delete tickets, update statuses, act on any comments.
- **SUPPORT**: Can view assigned tickets, update ticket configurations/statuses (if assigned), comment on assigned tickets.
- **USER**: Can create tickets, view own tickets, and comment on own tickets.
