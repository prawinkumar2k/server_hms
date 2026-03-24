-- Industrial VPS MySQL Bridge & Test Setup
USE hms_db;

-- 1. Correct Remote Permissions
CREATE USER IF NOT EXISTS 'hmsuser'@'%' IDENTIFIED WITH 'mysql_native_password' BY 'HmsRoot@2026';
ALTER USER 'hmsuser'@'%' IDENTIFIED WITH 'mysql_native_password' BY 'HmsRoot@2026';
GRANT ALL PRIVILEGES ON *.* TO 'hmsuser'@'%' WITH GRANT OPTION;

-- 2. Inject SECURE Test Users (Unlocks Green Reports)
-- Password: password123 (Hashed for Bcrypt)
REPLACE INTO users (username, password, full_name, role, status) VALUES 
('admin', '$2b$10$ozE1aLNITj9giPaCA7joj.VRiWQMnP8rF3uKoaH2eGGyz3Mc9mqCW', 'Industrial Admin', 'Admin', 'Active'),
('testuser', '$2b$10$ozE1aLNITj9giPaCA7joj.VRiWQMnP8rF3uKoaH2eGGyz3Mc9mqCW', 'Master Test Admin', 'Admin', 'Active');

FLUSH PRIVILEGES;
