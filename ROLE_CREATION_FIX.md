# ROOT CAUSE ANALYSIS: Role Creation 500 Error

## Error Reported
```
POST http://192.168.1.7:5173/api/admin/roles 500 (Internal Server Error)
Server error creating role
```

## **ROOT CAUSE FOUND!**

### Issue #1: Vite Proxy Not Working (PRIMARY)
The request shows it's hitting `http://192.168.1.7:5173/api/admin/roles` instead of `http://192.168.1.7:3000/api/admin/roles`.

**Why This Happens:**
- You're accessing Vite from network IP (`192.168.1.7`)
- Vite proxy doesn't properly intercept `/api` requests when accessed from network IPs
- The request never reaches the backend server on port 3000

### Issue #2: Missing Database Tables (SECONDARY - FIXED)
The backend expects these tables:
- ✅ `roles` table - **CREATED**
- ✅ `permissions` table - **CREATED**  
- ✅ `role_permissions` table - **CREATED**

These were created successfully using `scripts/setup_rbac_schema.js`.

### Issue #3: Frontend Type Mismatch (TERTIARY - FIXED)
The dropdown showed "Main Role" but sent `type: "custom"` instead of `type: "main"`.

**Fixed in:**
- `UserManagement.jsx` line 391: Changed `<option value="custom">Main Role</option>` to `<option value="main">Main Role</option>`
- Added `<option value="custom">Custom Role</option>` for clarity
- Updated default roleForm type from `'custom'` to `'main'`
- Updated resetForm to use `'main'`

---

## Database Schema Created

### Roles Table
```sql
CREATE TABLE roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    is_system BOOLEAN DEFAULT FALSE,
    type ENUM('main', 'sub', 'custom') DEFAULT 'custom',
    parent_role_id INT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (parent_role_id) REFERENCES roles(id) ON DELETE SET NULL
)
```

### Permissions Table
```sql
CREATE TABLE permissions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    module_name VARCHAR(50) NOT NULL,
    action VARCHAR(50) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
```

### Role_Permissions Table
```sql
CREATE TABLE role_permissions (
    role_id INT NOT NULL,
    permission_id INT NOT NULL,
    granted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (role_id, permission_id),
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
    FOREIGN KEY (permission_id) REFERENCES permissions(id) ON DELETE CASCADE
)
```

---

## What's Been Fixed

✅ **Database Schema**: All RBAC tables created successfully
✅ **System Roles**: 10 default roles seeded (Admin, Doctor, etc.)
✅ **Permissions**: Default permissions created for all modules
✅ **Frontend Type Dropdown**: Fixed role type values to match database ENUM
✅ **Backend Controller**: Already has proper error handling from previous fixes

---

## What Still Needs Fixing

❌ **CRITICAL: Vite Proxy Issue**

The request is hitting port 5173 (Vite) instead of port 3000 (backend).

---

## SOLUTIONS TO FIX PROXY ISSUE

### Option 1: Access via Localhost (QUICK FIX)
Instead of `http://192.168.1.7:5173`, use:
```
http://localhost:5173
```

This makes the Vite proxy work reliably.

### Option 2: Restart Vite with Clean Cache (RECOMMENDED)
```bash
# In the client terminal:
Ctrl+C (stop the dev server)npm run dev
# Clear browser cache: Ctrl + Shift + R
```

### Option 3: Access Backend Directly from Network
The backend is already accessible from the network. Test it:
```powershell
# This should work:
Invoke-RestMethod -Uri "http://192.168.1.7:3000/api/health" -Method GET
```

If you want to use the network IP for the frontend, you have two options:

**A. Add environment variable in frontend:**
Create `client/.env`:
```env
VITE_API_BASE_URL=http://192.168.1.7:3000
```

Then update `AuthContext.jsx` and other API calls to use:
```javascript
const API_BASE = import.meta.env.VITE_API_BASE_URL || '';
fetch(`${API_BASE}/api/admin/roles`, {...})
```

**B. Configure Vite to use the actual IP:**
Update `client/vite.config.js`:
```javascript
proxy: {
  '/api': {
    target: 'http://192.168.1.7:3000',  // Use actual IP
    changeOrigin: true,
    secure: false,
  },
}
```

---

## Testing the Fix

Once you fix the proxy issue, test role creation:

1. **Access** your app (use localhost:5173 for now)
2. **Login** as admin
3. **Go to** System Management > Roles tab
4. **Click** "Add Role"
5. **Fill in:**
   - Role Name: "Emergency Doctor"
   - Description: "Handles emergency cases"
   - Role Type: "Main Role" (will send `type: "main"`)
6. **Click** "Create Role"

**Expected Result:** Role created successfully!

---

## Current Status

| Component | Status | Notes |
|-----------|--------|-------|
| Backend Server | ✅ Running on 0.0.0.0:3000 | Accessible |
| Database Tables | ✅ Created | Full RBAC schema |
| Backend Controller | ✅ Working | Tested directly |
| Frontend Code | ✅ Fixed | Type dropdown corrected |
| **Vite Proxy** | ❌ **NOT WORKING** | **BLOCKS ALL API CALLS** |

---

## Immediate Action Required

**Choice A:** Use `http://localhost:5173` to access your app (proxy will work)

**Choice B:** Restart Vite dev server and clear browser cache

**Choice C:** Configure frontend to connect directly to `http://192.168.1.7:3000`

Pick one and try creating the role again!
