# 💻 Frontend Setup Guide (Client)

This guide covers the verification, installation, and configuration of the React frontend application.

## 📋 Prerequisites
*   **Node.js**: v18+ Recommended.
*   **NPM**: v9+ (Included with Node.js).

## 🛠️ Installation Steps

### 1. Navigate to Client Directory
Open your terminal and move to the client folder:
```bash
cd client
```

### 2. Install Dependencies
Install all required packages defined in `package.json`.
```bash
npm install
```

### 3. Environment Configuration
Create a `.env` file in the `client` directory to store environment-specific variables.
**Note**: Variables in Vite must start with `VITE_` to be exposed to the client-side code.

**Create file:** `client/.env`
```env
# The Base URL for your Backend API
# Ensure this matches the PORT your server is running on
VITE_API_BASE_URL=http://localhost:5000

# (Optional) Application Title
VITE_APP_TITLE=HMS Dashboard
```

### 4. Running the Development Server
Start the local development server with hot-reloading:
```bash
npm run dev
```
*   The app typically starts at `http://localhost:5173`.
*   Check the terminal output for the exact URL.

---

## 🔒 Private Data & Security
*   **NO SECRETS IN CLIENT**: Never store real passwords, database keys, or secret API tokens in the client-side `.env`. These are visible to the browser.
*   Only expose public identifiers or API endpoints.

## 📦 Build for Production
To create an optimized production build:
```bash
npm run build
```
The output will be in the `client/dist` folder, ready for deployment.
