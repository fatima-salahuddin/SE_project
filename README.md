# E-Commerce Website Database System - Setup Guide

This guide provides step-by-step instructions to set up and run the E-Commerce Website Database System on a new PC.

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

1.  **Node.js**: Download and install from [nodejs.org](https://nodejs.org/). (LTS version recommended).
2.  **Oracle Database**: You need access to an Oracle Database (e.g., Oracle Database XE).
3.  **Oracle Instant Client**: Required for the Node.js driver to connect to Oracle.
    *   Download "Basic" package from [Oracle Instant Client Downloads](https://www.oracle.com/database/technologies/instant-client.html).
    *   Extract it to a folder (e.g., `C:\oracle\instantclient_19_8`).
    *   **Important**: Add this folder path to your system's `PATH` environment variable.

## 🚀 Installation & Setup

### 1. Copy Project Files
Copy the entire project folder to your new PC.

### 2. Install Dependencies
Open a terminal (Command Prompt or PowerShell) in the project folder and run:
```bash
npm install
```

### 3. Configure Environment Variables
1.  Find the file named `.env` in the project folder.
2.  Open it with a text editor (Notepad, VS Code).
3.  Update the values to match your new PC's database setup:

```ini
# Database Credentials
DB_USER=your_db_username      # e.g., SYSTEM or C##PROJECT
DB_PASSWORD=your_db_password  # e.g., 123456
DB_CONNECT_STRING=localhost/XE # Your Service Name (XE is common for Express Edition)

# Oracle Client Path (Update this to where you extracted Instant Client)
ORACLE_CLIENT_LIB_DIR=C:\oracle\instantclient_19_8

# Server Port
PORT=3000
```

### 4. Database Setup (If moving to a fresh DB)
If your new PC has an empty database, you need to create the tables and data.

1.  **Open SQL Plus** or **SQL Developer**.
2.  Connect to your database.
3.  Run the scripts in this **exact order**:
    *   `database/schema.sql` (Creates tables)
    *   `database/seed.sql` (Inserts dummy data)
    *   `database/advanced.sql` (Adds Triggers, Procedures, and Locks)
    *   `database/add_price_constraint.sql` (Adds Price Constraints)

*Alternatively, you can run the Node.js helper scripts:*
```bash
node scripts/apply_advanced_db.js
node scripts/apply_price_constraint.js
```

## ▶️ Running the Application

1.  Start the server:
    ```bash
    npm start
    ```
2.  You should see:
    ```
    Server is running on http://localhost:3000
    Connected to Oracle Database...
    ```
3.  Open your browser and go to `http://localhost:3000`.

## 🛠️ Troubleshooting

*   **Error: `DPI-1047: Cannot locate a 64-bit Oracle Client library`**
    *   Make sure `ORACLE_CLIENT_LIB_DIR` in `.env` points to the correct folder.
    *   Make sure you installed the **64-bit** Instant Client if you have 64-bit Node.js.
    *   Restart your terminal/VS Code after changing environment variables.

*   **Error: `ORA-12541: TNS:no listener`**
    *   Your Oracle Database service is not running. Start it from Windows Services.

*   **Error: `ORA-01017: invalid username/password`**
    *   Double-check `DB_USER` and `DB_PASSWORD` in your `.env` file.
