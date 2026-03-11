# 🚀 HMS Hosting Process: Step-by-Step Walkthrough

Below is the exact chronological process we followed to take the HMS project from local development to a production-ready Hostinger VPS.

---

## Phase 1: VPS Environment Setup
We started with a clean **Ubuntu 24.04** installation and prepared the software stack.
1.  **System Updates:** Updated the server package list.
2.  **Node.js Installation:** Installed Node.js v20 (LTS) using the Nodesource repository.
3.  **Process Manager:** Installed `PM2` globally to keep the backend running 24/7.
4.  **Web Server:** Installed `Nginx` to handle web traffic.
5.  **Database:** Installed `MySQL Server` and created the `hms_db` database and `hmsuser`.

---

## Phase 2: Database Migration
1.  **Export:** Created a `.sql` dump of the local database (`hmsdb.sql`).
2.  **Transfer:** Uploaded the SQL file to the VPS using `SCP`.
3.  **Import:** Executed the SQL file into the server's MySQL instance to restore all patient, doctor, and user data.

---

## Phase 3: Backend Deployment
1.  **Code Upload:** Zipped the backend `server` folder (excluding `node_modules`) and uploaded it to `/var/www/hms/server/`.
2.  **Environment Config:** Created a production `.env` file on the server with correct DB credentials and Port (5000).
3.  **Dependencies:** Ran `npm install --omit=dev` directly on the VPS.
4.  **Process Start:** Started the server using `pm2 start server.js --name hms-backend`.

---

## Phase 4: Frontend Deployment & Nginx
1.  **Local Build:** Ran `npm run build` on the local machine to generate the `dist` folder.
2.  **Upload:** Transferred the `dist` contents to `/var/www/hms/frontend/`.
3.  **Nginx Config:** Created a configuration file to:
    *   Serve the `index.html` on Port 80.
    *   Proxy all `/api` calls to the Node.js backend running on Port 5000.
4.  **Activation:** Reloaded Nginx to make the site live at the IP address.

---

## Phase 5: CI/CD Automation (The "Magic" Part)
We automated the deployment so you never have to manually upload files again.
1.  **Workflow File:** Created `.github/workflows/deploy.yml` in your repository.
2.  **Secrets:** Added `VPS_HOST`, `VPS_USER`, and `VPS_PASSWORD` to GitHub Secrets.
3.  **SSH Prep:** Enabled Password Authentication in the server's SSH config to allow GitHub to connect.
4.  **Result:** Now, every time you `git push`, GitHub automatically builds the frontend and updates the VPS.

---

## Phase 6: Optimization & Data Safety
1.  **Cluster Mode:** Re-started PM2 in **Cluster Mode** using 4 CPU cores for better traffic handling.
2.  **MySQL Tuning:** Optimized the memory buffer for faster database queries.
3.  **Log Rotation:** Set up `pm2-logrotate` to prevent logs from filling up the disk.
4.  **Auto-Bakcups:** Created a Bash script and a **Cron Job** to back up the database every night at 2:00 AM.

---

## Phase 7: Functional Fixes
1.  **Sidebar Patch:** Fixed a database mapping issue where "Pharma Master" users were missing sidebar modules.
2.  **Health Check:** Implemented a `/api/health` endpoint to monitor system uptime.

---

### 🏁 Final Result
Your application is currently live at **`http://72.61.229.231`**, running highly optimized, with nightly backups and automated updates from GitHub.
