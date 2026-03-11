// Centralized definition of mandatory modules per role
// These keys MUST match the broad 'module_key' values in 'sidebar_modules'

const ROLE_MANDATORY_MODULES = {
    'Doctor': ['dashboard', 'opd', 'lab', 'ipd', 'reports', 'appointments'],
    'Receptionist': ['dashboard', 'reception', 'opd', 'appointments', 'billing'],
    'Pharmacist': ['dashboard', 'pharmacy'],
    'PHARMA_MASTER': ['dashboard', 'pharmacy'],
    'Lab Technician': ['dashboard', 'lab'],
    'LAB_MASTER': ['dashboard', 'lab'],
    'Accountant': ['dashboard', 'billing'],
    'Nurse': ['dashboard', 'ipd'],
    'HR': ['dashboard', 'payroll'],
    'Admin': ['dashboard', 'users', 'logs', 'payroll', 'pharmacy', 'lab', 'reception', 'ipd', 'opd', 'billing', 'reports', 'appointments'],
    'Trainee': ['dashboard']
};

module.exports = ROLE_MANDATORY_MODULES;
