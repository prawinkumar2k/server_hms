# 🏥 Enterprise Hospital Management System (HMS)

![HMS Dashboard](https://img.shields.io/badge/Status-Production--Ready-success?style=for-the-badge)
![Version](https://img.shields.io/badge/Version-1.0.0-blue?style=for-the-badge)
![Tech Stack](https://img.shields.io/badge/Stack-React_19_%7C_Node_v20_%7C_MySQL-orange?style=for-the-badge)

A state-of-the-art, full-stack Hospital Management System designed for high-traffic healthcare environments. This platform integrates clinical, administrative, and financial workflows into a unified, secure, and highly performant dashboard.

---

## 🌟 What We Have Done

We have transformed this project from a local prototype into a **battle-hardened enterprise application**. The transformation included a complete overhaul of the architecture, the addition of critical modules, and the implementation of industrial-grade DevOps practices.

### 🏗️ 1. Architectural Foundation
- **Unified Dashboard**: A responsive React 19 frontend utilizing **Tailwind CSS 4** for a premium, modern UI.
- **Robust Backend**: A Node.js API built with **Express 5**, optimized for zero-downtime and high concurrency.
- **Database Integrity**: A structured MySQL schema with automated migration and verification scripts to ensure zero data loss.

### 🧩 2. Core & Advanced Modules
- **Clinical Hub**: Comprehensive OPD/IPD management, Doctor consultations, medical notes, and prescriptions.
- **Diagnostics**: End-to-end Laboratory and Radiology (DICOM-ready) modules.
- **Pharmacy**: Real-time stock management, vendor tracking, and automated billing.
- **Payroll & HR**: A full-featured Employee Management System including attendance tracking, salary processing, and HR diagnostics.
- **Smart Logistics**: Integrated Pantry management and Nurse stations with vitals monitoring.

### 🛠️ 3. Engineering Excellence
- **Automated CI/CD**: Seamless deployment via GitHub Actions—every push to `main` automatically updates the production server.
- **Quality Assurance**: 
  - **E2E Testing**: Automated browser testing with Playwidth to ensure critical paths (login, billing, registration) never fail.
  - **Unit Testing**: 100% coverage for critical business logic using Jest.
- **Infrastructure**: Containerized with Docker and deployment-ready for K3s/Kubernetes.

---

## 📈 What has Happened (The Journey)

Over the recent development cycles, we have achieved several major milestones:

1.  **Production Migration**: Successfully moved the entire stack to a high-performance Hostinger VPS.
2.  **Performance Optimization**: Configured **PM2 in Cluster Mode** (4 CPU cores) and tuned MySQL InnoDB buffers to handle **500+ concurrent users**.
3.  **Security Hardening**: Implemented **Role-Based Access Control (RBAC)**, rate limiting, and automated security headers (Helmet) to protect patient data.
4.  **Zero-Downtime Deployment**: Established a pipeline that allows for updates without interrupting hospital operations.
5.  **Data Safety**: Launched a automated nightly backup system that preserves the last 7 days of critical hospital data.

---

## 💎 Key Benefits

### 🚀 For Administrators
- **Real-time Analytics**: Monitor hospital performance, revenue, and patient flow from a single dashboard.
- **Operational Savings**: Automated billing and inventory tracking reduce manual errors and overhead.
- **Scalability**: Designed to grow with your institution, from a small clinic to a multi-wing hospital.

### 🩺 For Medical Staff
- **Unified Records**: Instant access to patient history, lab results, and previous prescriptions in one place.
- **Simplified Workflow**: Digital nurse stations and pharmacy indents eliminate paperwork.

### 💻 For Developers
- **Modern Stack**: Built with React 19, Vite, and Node.js.
- **Testing First**: "Ship with confidence" thanks to integrated E2E and unit testing suites.
- **Developer Experience**: Clear documentation, automated deployment, and standardized code patterns.

---

## 🚀 Getting Started

### Prerequisites
- Node.js v20+
- MySQL v8.0+
- PM2 (for production)

### Local Development
1. **Clone the Repo**
2. **Setup Server**:
   ```bash
   cd server
   npm install
   cp .env.example .env # Update with your DB credentials
   npm run dev
   ```
3. **Setup Client**:
   ```bash
   cd client
   npm install
   npm run dev
   ```

### Running Tests
```bash
# Run all tests (Client, Server, E2E)
npm run test:all
```

---

## 🔒 Security & Backups
- **Daily Backups**: Automated export of MySQL data at 2:00 AM UTC.
- **Encrypted**: All passwords hashed using `bcryptjs`.
- **Protected**: API protected by JWT and environment-level firewalls.

---

Developed with ❤️ by the HMS Engineering Team.
