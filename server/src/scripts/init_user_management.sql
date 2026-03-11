-- 1. Create Users Roles Table
CREATE TABLE IF NOT EXISTS users_roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    role VARCHAR(50) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 2. Create Sidebar Modules Table
CREATE TABLE IF NOT EXISTS sidebar_modules (
    id INT AUTO_INCREMENT PRIMARY KEY,
    module_name VARCHAR(100) NOT NULL,
    module_key VARCHAR(50) NOT NULL UNIQUE,
    module_category VARCHAR(50) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Create Staff Master Table (if not exists, as required for linkage)
CREATE TABLE IF NOT EXISTS staff_master (
    id INT AUTO_INCREMENT PRIMARY KEY,
    staff_id VARCHAR(50) NOT NULL UNIQUE,
    staff_name VARCHAR(100) NOT NULL,
    department VARCHAR(50),
    email VARCHAR(100),
    mobile VARCHAR(20),
    status ENUM('Active', 'Inactive') DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Create Users Table (or Update if exists)
-- Using a temporary table structure to ensure we match requirements, then we can migrate data if needed.
-- But for this task, I will create it if not exists. If exists, I'll attempt to add missing columns.

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(100), -- specific to existing schema compatibility if needed, but user asked for staff_name linkage
    staff_id VARCHAR(50), -- Link check
    role VARCHAR(50) NOT NULL,
    module_access TEXT, -- Comma-separated keys
    status ENUM('Active', 'Inactive') DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (staff_id) REFERENCES staff_master (staff_id) ON DELETE SET NULL,
    FOREIGN KEY (role) REFERENCES users_roles (role) ON UPDATE CASCADE
);

-- 5. Create Log Details Table
CREATE TABLE IF NOT EXISTS log_details (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    role VARCHAR(50) NOT NULL,
    action VARCHAR(255) NOT NULL,
    details TEXT,
    login_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_username (username),
    INDEX idx_created_at (created_at)
);

-- Seed Initial Roles
INSERT IGNORE INTO
    users_roles (role)
VALUES ('Admin'),
    ('Doctor'),
    ('Receptionist'),
    ('Pharmacist'),
    ('Lab Technician');

-- Seed Initial Modules
INSERT IGNORE INTO
    sidebar_modules (
        module_name,
        module_key,
        module_category
    )
VALUES (
        'Dashboard',
        'dashboard',
        'General'
    ),
    (
        'Patient Management',
        'patients',
        'Clinical'
    ),
    (
        'Appointments',
        'appointments',
        'Clinical'
    ),
    (
        'Billing',
        'billing',
        'Finance'
    ),
    (
        'Pharmacy',
        'pharmacy',
        'Inventory'
    ),
    (
        'Laboratory',
        'lab',
        'Clinical'
    ),
    (
        'User Management',
        'users',
        'Admin'
    ),
    ('Logs', 'logs', 'Admin');

-- Seed Admin User (Password: admin123)
-- Hash: $2a$10$X7.1.1.1.1.1.1.1.1.1.1 (Just a placeholder, logic handles actual hashing)
-- INSERT IGNORE INTO users ... (Handled by backend logic normally, but good to have one admin)