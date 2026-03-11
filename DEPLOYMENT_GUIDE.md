# 🏥 HMS Dashboard - Deployment & Operations Manual

This document provides a comprehensive overview of the deployment structure, automation, and management processes implemented for the Hospital Management System (HMS) on the Hostinger VPS.

---

## 🌐 Server Overview
- **IP Address:** `72.61.229.231`
- **Operating System:** Ubuntu 24.04 LTS (minimal)
- **Primary Domain:** `http://72.61.229.231` (Pending domain: `polyqbase.in`)
- **Technology Stack:** Node.js (v20), MySQL (v8.0), Nginx, PM2.

---

## 📂 Directory Structure

| Path | Purpose |
| :--- | :--- |
| `/var/www/hms/` | Root application directory |
| `/var/www/hms/frontend/` | Compiled React/Vite production build (dist) |
| `/var/www/hms/server/` | Node.js Backend code |
| `/var/www/hms/server/uploads/` | User-uploaded files (prescriptions, records) |
| `/var/backups/hms/`| Automated daily database backups (.sql.gz) |

---

## ⚙️ Service Configuration

### 1. Nginx (Web Server & Reverse Proxy)
Nginx handles incoming traffic on Port 80, serves the frontend files directly, and proxies API requests to the Node.js backend.
- **Config Path:** `/etc/nginx/sites-available/hms`
- **Features:** Gzip compression, 1-year browser caching for assets, SPA routing support.

### 2. PM2 (Process Manager)
The backend runs in **Cluster Mode** to utilize multiple CPU cores for high performance.
- **Process Name:** `hms-backend`
- **Instances:** 4 (Optimized for multi-site VPS)
- **Auto-restart:** Enabled on server reboot and crash.
- **Logs:** Managed via `pm2-logrotate` (50MB max size, 7-day retention).

### 3. MySQL (Database)
- **Database Name:** `hms_db`
- **Optimizations:** 1GB InnoDB Buffer Pool, 200 Max Connections, tuned for high-speed writes.

---

## 🚀 CI/CD Pipeline (GitHub Actions)

We have implemented a fully automated deployment pipeline.
- **Trigger:** Every `git push origin main`
- **Workflow Path:** `.github/workflows/deploy.yml`

### What happens during deployment:
1. **Build:** GitHub builds the React frontend.
2. **Transfer:** Compiled frontend and updated server files are uploaded via Secure Copy (SCP).
3. **Install:** `npm install` runs on the VPS (omitting development dependencies).
4. **Reload:** PM2 performs a zero-downtime restart of the `hms-backend`.

---

## 💾 Automated Backup System

To protect hospital data, a nightly backup script is active.
- **Script Path:** `/usr/local/bin/hms-backup.sh`
- **Schedule:** Daily at **2:00 AM UTC** (Cron job).
- **Retention:** Only the last **7 days** of backups are kept to save storage.
- **Command to manually run:** `sudo /usr/local/bin/hms-backup.sh`

---

## 🔧 Troubleshooting & Common Commands

### Check Backend Status
```bash
pm2 status hms-backend
pm2 logs hms-backend
```

### Check Nginx Logs (Traffic Errors)
```bash
tail -f /var/log/nginx/error.log
```

### Manually Restart Everything
```bash
systemctl restart nginx
systemctl restart mysql
pm2 restart all
```

### View Backups
```bash
ls -lh /var/backups/hms/
```

---

## 🔐 Credentials Summary
*(Stored here for documentation reference)*

| Service | Username | Password |
| :--- | :--- | :--- |
| **VPS SSH** | `root` | `HmsRoot@2026` |
| **MySQL Service** | `hmsuser` | `HmsDB2026` |
| **Admin Login** | `admin` | `admin123` |
| **Database Name** | `hms_db` | |

---

> [!NOTE]
> This server is optimized for high traffic. The current configuration can comfortably handle **500+ concurrent users** and millions of data records.
