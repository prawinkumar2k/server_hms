# ⚙️ Backend Setup Guide (Server)

This guide details the setup of the Node.js/Express backend, including critical database configurations and security practices.

## 📋 Prerequisites
*   **Node.js**: v18+ Required.
*   **MySQL Server**: Must be installed and running locally or remotely.
*   **Git**: For version control.

## 🛠️ Installation Steps

### 1. Navigate to Server Directory
```bash
cd server
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Database Initialization
Before starting the server, you must set up the MySQL database schema.
1.  **Locate the SQL File**: The schema is located at `server/database/hms.sql` (or if it was removed for security, ensure you have the schema backup provided by your team).
2.  **Import to MySQL**:
    *   **Command Line**:
        ```bash
        mysql -u root -p < database/hms.sql
        ```
    *   **GUI (Workbench / phpMyAdmin)**: Create a new DB named `hms_db`, usually `utf8mb4`, and Import the `.sql` file.

### 4. 🔑 Environment Configuration (CRITICAL)
You **MUST** create a `.env` file in the `server` directory. This file contains sensitive credentials and is **ignored** by Git to prevent data leaks.

**Create file:** `server/.env`
**Copy the content below and replace with YOUR actual values:**

```env
# ==============================================
# SERVER CONFIGURATION
# ==============================================
PORT=5000
NODE_ENV=development

# ==============================================
# DATABASE CREDENTIALS (SENSITIVE)
# ==============================================
# The host address of your MySQL server (usually localhost for local dev)
DB_HOST=localhost

# Your MySQL Username (default is often 'root')
DB_USER=root

# Your MySQL Password
# WARNING: Ensure this is complex in production.
DB_PASSWORD=your_actual_mysql_password_here

# The name of the database you created/imported
DB_NAME=hms_db

# ==============================================
# SECURITY TOKENS (SENSITIVE)
# ==============================================
# High-entropy string used to sign JWTs for user authentication.
# You can generate one using: openssl rand -base64 32
JWT_SECRET=super_long_random_secret_string_make_this_secure

# Token Expiry (e.g., 1h, 7d)
JWT_EXPIRES_IN=1d
```

### 5. Start the Server
```bash
npm start
```
*   The server should log `Server running on port 5000`.
*   It should also log `Database connected...` if credentials are correct.

---

## 🛡️ Security Best Practices
1.  **Never Commit .env**: The `.gitignore` ensures this file is not pushed.
2.  **Rotation**: If you believe your `DB_PASSWORD` or `JWT_SECRET` has been exposed, change them immediately in your environment and restart the server.
3.  **Least Privilege**: For production, create a dedicated DB user for this app with limited permissions, rather than using `root`.
