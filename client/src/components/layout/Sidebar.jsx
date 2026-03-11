import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
    LayoutDashboard, Users, FileText,
    LogOut, ChevronLeft, ChevronRight,
    Building2, Database, ShoppingCart, FlaskConical,
    TestTube2, Search, ChevronsUpDown, MoreHorizontal,
    Stethoscope, Pill, ClipboardList, Activity,
    History, BarChart3, ChevronDown, CreditCard, Shield, BadgeDollarSign,
    Calendar, CheckCircle, BedDouble, UserPlus, Receipt, Truck, RefreshCw, Clock, Mail, Package,
    Heart, Utensils, Syringe
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { cn } from '../../lib/utils';
import { motion } from 'framer-motion';
import MasterSearch from '../common/MasterSearch';

// Sub-component for Collapsible Groups to safely use hooks
const SidebarGroup = ({ group, collapsed, mobileOpen, isActive }) => {
    const [isOpen, setIsOpen] = useState(true);

    // If active status changes (e.g. navigation), open the group
    useEffect(() => {
        if (isActive) setIsOpen(true);
    }, [isActive]);

    const isMini = collapsed && !mobileOpen;

    return (
        <div className="mb-2">
            {!isMini ? (
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="w-full flex items-center justify-between px-2 py-1.5 mb-1 group text-slate-400 hover:text-slate-600 transition-colors"
                >
                    <span className="text-[11px] font-bold uppercase tracking-wider">
                        {group.label}
                    </span>
                    <ChevronDown className={cn(
                        "h-3 w-3 transition-transform duration-200",
                        isOpen ? "transform rotate-0" : "transform -rotate-90"
                    )} />
                </button>
            ) : (
                <div className="h-px bg-slate-100 mx-2 my-2" />
            )}

            <div className={cn(
                "space-y-0.5 overflow-hidden transition-all duration-300 ease-in-out",
                !isMini && !isOpen ? "max-h-0 opacity-0" : "max-h-[800px] opacity-100"
            )}>
                {group.items.map((item, itemIndex) => (
                    <NavLink
                        key={itemIndex}
                        to={item.path}
                        className={({ isActive }) => cn(
                            "flex items-center gap-3 px-2 py-2 rounded-md transition-all group relative",
                            collapsed ? "md:justify-center md:aspect-square" : "ml-2",
                            isActive
                                ? "bg-white shadow-sm text-indigo-600 font-medium ring-1 ring-slate-200"
                                : "hover:bg-slate-100 hover:text-slate-900"
                        )}
                    >
                        <item.icon className={cn(
                            "shrink-0 transition-colors",
                            collapsed ? "md:h-5 md:w-5" : "h-4 w-4"
                        )} />

                        {(!collapsed || mobileOpen) && (
                            <span className="text-sm truncate flex-1">{item.title}</span>
                        )}

                        {/* Badge */}
                        {(!collapsed || mobileOpen) && item.badge && (
                            <span className="bg-slate-100 text-slate-600 text-[10px] font-bold px-1.5 py-0.5 rounded-md border border-slate-200">
                                {item.badge}
                            </span>
                        )}

                        {/* Collapsed Tooltip (Desktop Only) */}
                        {collapsed && !mobileOpen && (
                            <div className="hidden md:block absolute left-full ml-4 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-[60] shadow-xl">
                                {item.title}
                            </div>
                        )}
                    </NavLink>
                ))}
            </div>
        </div>
    );
};

const Sidebar = ({ collapsed, setCollapsed, mobileOpen, setMobileOpen }) => {
    const { user } = useAuth();
    const location = useLocation();

    // Close mobile menu on route change
    useEffect(() => {
        if (setMobileOpen) setMobileOpen(false);
    }, [location.pathname]);

    // Role Based Menu Configuration with Module Keys
    const menuGroups = [
        {
            label: "Main",
            items: [
                {
                    title: "Dashboard",
                    icon: LayoutDashboard,
                    path: "/dashboard",
                    roles: ['Doctor', 'Receptionist', 'Pharmacist', 'Accountant', 'Nurse'],
                    module: 'dashboard'
                },
                {
                    title: "Reception",
                    icon: Users,
                    path: "/hospital/reception",
                    roles: ['Receptionist'],
                    module: 'reception'
                },
                {
                    title: "Appointments",
                    icon: Calendar,
                    path: "/hospital/appointments",
                    roles: ['Receptionist', 'Doctor'],
                    module: 'appointments'
                },
                {
                    title: "OPD - Patient Out",
                    icon: UserPlus,
                    path: "/hospital/opd",
                    roles: ['Doctor', 'Receptionist'],
                    module: 'opd'
                },
                {
                    title: "IPD - Patient In",
                    icon: BedDouble,
                    path: "/hospital/ipd",
                    roles: ['Nurse', 'Doctor', 'Receptionist'],
                    module: 'ipd'
                },
                {
                    title: "Patient List",
                    icon: ClipboardList,
                    path: "/hospital/patient-list",
                    roles: ['Receptionist'],
                    module: 'reception'
                },
                {
                    title: "Doctor Status",
                    icon: Stethoscope,
                    path: "/reception/doctors",
                    roles: ['Receptionist', 'Admin'],
                    module: 'reception'
                },
                {
                    title: "Smart Cards",
                    icon: CreditCard,
                    path: "/hospital/smart-cards",
                    roles: [],
                    module: 'reception'
                },
                {
                    title: "Billing & Payments",
                    icon: Receipt,
                    path: "/hospital/billing",
                    roles: ['Accountant', 'Receptionist'],
                    module: 'billing'
                },
                {
                    title: "Transactions",
                    icon: CreditCard,
                    path: "/hospital/appointment-transactions",
                    roles: ['Accountant'],
                    module: 'billing'
                },
                {
                    title: "Unified Billing",
                    icon: BadgeDollarSign,
                    path: "/hospital/unified-billing",
                    roles: ['Accountant'],
                    module: 'billing'
                }
            ]
        },

        {
            label: "Admin Workspace",
            roles: ['Admin'],
            items: [
                { title: "Dashboard", icon: LayoutDashboard, path: "/dashboard", roles: ['Admin'], module: 'dashboard' },
                { title: "User Management", icon: Users, path: "/admin/users/list", roles: ['Admin'], module: 'users' },
                { title: "System Monitoring", icon: Shield, path: "/admin/monitoring", roles: ['Admin'], module: 'logs' },
                { title: "Audit Logs", icon: FileText, path: "/admin/logs", roles: ['Admin'], module: 'logs' }
            ]
        },

        {
            label: "Payroll System",
            roles: ['Admin', 'HR'],
            items: [
                { title: "Dashboard", icon: LayoutDashboard, path: "/payroll/dashboard", roles: ['Admin', 'HR'], module: 'payroll' },
                { title: "Employee Master", icon: Users, path: "/payroll/employees", roles: ['Admin', 'HR'], module: 'payroll' },
                { title: "Attendance", icon: Clock, path: "/payroll/attendance", roles: ['Admin', 'HR'], module: 'payroll' },
                { title: "Salary Details", icon: BadgeDollarSign, path: "/payroll/salaries", roles: ['Admin', 'HR'], module: 'payroll' },
                { title: "Run Payroll", icon: CreditCard, path: "/payroll/process", roles: ['Admin', 'HR'], module: 'payroll' }
            ]
        },

        {
            label: "Clinical",
            roles: ['Doctor'],
            items: [
                { title: "My Consultations", icon: Stethoscope, path: "/doctor/consultations", roles: ['Doctor'], badge: "3", module: 'opd' },
                { title: "Lab Requests", icon: TestTube2, path: "/doctor/lab-request", roles: ['Doctor'], module: 'lab' },
                { title: "Lab Results", icon: FileText, path: "/doctor/lab-results", roles: ['Doctor'], module: 'lab' },
            ]
        },
        {
            label: "IPD Rounds",
            roles: ['Doctor'],
            items: [
                { title: "IPD Patients", icon: BedDouble, path: "/doctor/ipd-patients", roles: ['Doctor'], module: 'ipd' },
            ]
        },
        {
            label: "Nurse Station",
            roles: ['Nurse'],
            items: [
                { title: "Dashboard", icon: LayoutDashboard, path: "/nurse/dashboard", roles: ['Nurse'], module: 'nurse' },
                { title: "Ward Indent", icon: Package, path: "/nurse/ward-indent", roles: ['Nurse'], module: 'nurse' },
            ]
        },
        {
            label: "Pantry",
            roles: ['Pantry', 'Nurse'],
            items: [
                { title: "Dashboard", icon: Utensils, path: "/pantry/dashboard", roles: ['Pantry', 'Nurse'], module: 'pantry' },
                { title: "Food Menu", icon: ClipboardList, path: "/pantry/menu", roles: ['Pantry', 'Nurse'], module: 'pantry' },
                { title: "Serving History", icon: History, path: "/pantry/history", roles: ['Pantry', 'Nurse'], module: 'pantry' }
            ]
        },
        {
            label: "Reports",
            roles: ['Admin', 'Doctor', 'Receptionist'],
            items: [
                { title: "Daily OP", icon: ClipboardList, path: "/hospital/reports/daily-op", roles: ['Admin', 'Doctor'], module: 'reports' },
                { title: "Patient History", icon: History, path: "/hospital/reports/patient-history", roles: ['Admin', 'Doctor'], module: 'reports' }
            ]
        },
        {
            label: "Pharmacy",
            roles: ['Pharmacist', 'PHARMA_MASTER'],
            items: [
                { title: "Dashboard", icon: LayoutDashboard, path: "/pharmacy/dashboard", roles: ['Pharmacist', 'PHARMA_MASTER'], module: 'pharmacy' },
                { title: "Patient Details", icon: Users, path: "/pharmacy/patient-details", roles: ['Pharmacist', 'PHARMA_MASTER'], module: 'pharmacy' },
                { title: "Pending Requests", icon: ClipboardList, path: "/pharmacy/requests/pending", roles: ['Pharmacist', 'PHARMA_MASTER'], module: 'pharmacy' }
            ]
        },
        {
            label: "Pharma Billing",
            roles: ['Pharmacist', 'PHARMA_MASTER'],
            items: [
                { title: "Billing", icon: Receipt, path: "/pharmacy/billing", roles: ['Pharmacist', 'PHARMA_MASTER'], module: 'pharma_billing' },
                { title: "Return Billing", icon: RefreshCw, path: "/pharmacy/billing/return", roles: ['Pharmacist', 'PHARMA_MASTER'], module: 'pharma_billing' }
            ]
        },
        {
            label: "Pharma Inventory",
            roles: ['Pharmacist', 'PHARMA_MASTER'],
            items: [
                { title: "Stock Update", icon: RefreshCw, path: "/pharmacy/stock-entry", roles: ['Pharmacist', 'PHARMA_MASTER'], module: 'pharma_inventory' },
                { title: "Purchase Entry", icon: ShoppingCart, path: "/pharmacy/purchase-entry", roles: ['Pharmacist', 'PHARMA_MASTER'], module: 'pharma_inventory' },
                { title: "Suppliers", icon: Truck, path: "/pharmacy/suppliers", roles: ['PHARMA_MASTER'], module: 'pharma_inventory' },
                { title: "Stock Orders", icon: Package, path: "/pharmacy/stock-orders", roles: ['PHARMA_MASTER'], module: 'pharma_inventory' }
            ]
        },
        {
            label: "Pharma Reports",
            roles: ['Pharmacist', 'PHARMA_MASTER'],
            items: [
                { title: "Sales Report", icon: BarChart3, path: "/pharmacy/reports/daily", roles: ['Pharmacist', 'PHARMA_MASTER'], module: 'pharma_reports' },
                { title: "Stock Report", icon: ClipboardList, path: "/pharmacy/reports/stock", roles: ['Pharmacist', 'PHARMA_MASTER'], module: 'pharma_reports' },
                { title: "Purchase Report", icon: FileText, path: "/pharmacy/reports/purchase", roles: ['Pharmacist', 'PHARMA_MASTER'], module: 'pharma_reports' }
            ]
        },
        {
            label: "Laboratory",
            roles: ['Lab Technician', 'LAB_MASTER'],
            items: [
                { title: "Dashboard", icon: LayoutDashboard, path: "/lab/dashboard", roles: ['Lab Technician', 'LAB_MASTER'], module: 'lab' },
                { title: "Patient Details", icon: Users, path: "/lab/patients", roles: ['Lab Technician', 'LAB_MASTER'], module: 'lab' },
                { title: "Pending Requests", icon: ClipboardList, path: "/lab/requests/pending", roles: ['Lab Technician', 'LAB_MASTER'], module: 'lab' }
            ]
        },
        {
            label: "Lab Testing",
            roles: ['Lab Technician', 'LAB_MASTER'],
            items: [
                { title: "Test Master", icon: FlaskConical, path: "/lab-master/test-master", roles: ['Lab Technician', 'LAB_MASTER'], module: 'lab_testing' },
                { title: "Doctor Entry", icon: Stethoscope, path: "/lab-master/doctor-entry", roles: ['Lab Technician', 'LAB_MASTER'], module: 'lab_testing' },
                { title: "Test Entry", icon: FlaskConical, path: "/lab-entry/test-entry", roles: ['Lab Technician'], module: 'lab_testing' },
                { title: "Test Report", icon: FileText, path: "/lab-entry/report", roles: ['Lab Technician', 'LAB_MASTER'], module: 'lab_testing' }
            ]
        },
        {
            label: "Lab Inventory",
            roles: ['Lab Technician', 'LAB_MASTER'],
            items: [
                { title: "Product Master", icon: Database, path: "/lab/products", roles: ['Lab Technician', 'LAB_MASTER'], module: 'lab_inventory' },
                { title: "Indent Entry", icon: ClipboardList, path: "/lab/indents", roles: ['Lab Technician', 'LAB_MASTER'], module: 'lab_inventory' },
                { title: "Product Issue", icon: Package, path: "/lab/issues", roles: ['Lab Technician', 'LAB_MASTER'], module: 'lab_inventory' }
            ]
        },
        {
            label: "Lab Billing",
            roles: ['Lab Technician', 'LAB_MASTER'],
            items: [
                { title: "Lab Billing", icon: Receipt, path: "/lab-entry/billing", roles: ['Lab Technician', 'LAB_MASTER'], module: 'lab_billing' }
            ]
        },
        {
            label: "Stock Entry",
            roles: ['Pharmacist', 'PHARMA_MASTER'],
            items: [
                {
                    title: "Purchase Entry",
                    icon: ShoppingCart,
                    path: "/pharmacy/purchase-entry",
                    roles: ['Pharmacist', 'PHARMA_MASTER']
                },
                {
                    title: "Stock Update",
                    icon: RefreshCw,
                    path: "/pharmacy/stock-entry",
                    roles: ['Pharmacist', 'PHARMA_MASTER']
                }
            ]
        },
        {
            label: "Lab Supervision",
            roles: ['LAB_MASTER'],
            items: [
                {
                    title: "Dashboard",
                    icon: LayoutDashboard,
                    path: "/lab/dashboard",
                    roles: ['LAB_MASTER']
                },
                {
                    title: "Pending Requests",
                    icon: ClipboardList,
                    path: "/lab/requests/pending",
                    roles: ['LAB_MASTER']
                },
                {
                    title: "Raised Indents",
                    icon: Truck,
                    path: "/lab/indents",
                    roles: ['LAB_MASTER']
                },
                {
                    title: "Test Master",
                    icon: FlaskConical,
                    path: "/lab-master/test-master",
                    roles: ['LAB_MASTER']
                },
                {
                    title: "Doctor Entry",
                    icon: Stethoscope,
                    path: "/lab-master/doctor-entry",
                    roles: ['LAB_MASTER']
                }
            ]
        },
        {
            label: "Pharma Supervision",
            roles: ['PHARMA_MASTER', 'Pharmacist'],
            items: [
                {
                    title: "Dashboard",
                    icon: LayoutDashboard,
                    path: "/pharmacy/dashboard",
                    roles: ['PHARMA_MASTER']
                },
                {
                    title: "Pending Prescriptions",
                    icon: ClipboardList,
                    path: "/pharmacy/requests/pending",
                    roles: ['PHARMA_MASTER', 'Pharmacist']
                },
                {
                    title: "Stock Reports",
                    icon: BarChart3,
                    path: "/pharmacy/reports/stock",
                    roles: ['PHARMA_MASTER', 'Pharmacist']
                }
            ]
        },

    ];

    const adminMenuGroups = [
        {
            label: "Admin",
            items: [
                { title: "Dashboard", icon: LayoutDashboard, path: "/dashboard", roles: ['Admin'], module: 'dashboard' }
            ]
        },
        {
            label: "System Control",
            items: [
                { title: "Users & Roles", icon: Shield, path: "/admin/users/list", roles: ['Admin'], module: 'users' },
                { title: "System Monitoring", icon: Activity, path: "/admin/monitoring", roles: ['Admin'], module: 'logs' },
                { title: "Audit Logs", icon: FileText, path: "/admin/logs", roles: ['Admin'], module: 'logs' }
            ]
        },
        {
            label: "Patient Management",
            items: [
                { title: "All Patients", icon: Users, path: "/hospital/reception", roles: ['Admin'], module: 'reception' },
                { title: "Admissions / Discharges", icon: BedDouble, path: "/hospital/ipd", roles: ['Admin'], module: 'ipd' },
                { title: "Medical Records", icon: FileText, path: "/hospital/medical-records", roles: ['Admin'], module: 'reception' }
            ]
        },
        {
            label: "Doctor Management",
            items: [
                { title: "Doctors List", icon: Stethoscope, path: "/hospital/doctor-directory", roles: ['Admin'], module: 'opd' },
                { title: "Schedules", icon: Calendar, path: "/reception/doctors", roles: ['Admin'], module: 'reception' },
                { title: "Appointments", icon: Clock, path: "/hospital/appointments", roles: ['Admin'], module: 'appointments' }
            ]
        },
        {
            label: "Staff Management",
            items: [
                { title: "Nurses & Staff", icon: Users, path: "/payroll/employees", roles: ['Admin'], module: 'payroll' },
                { title: "Attendance", icon: ClipboardList, path: "/payroll/attendance", roles: ['Admin'], module: 'payroll' }
            ]
        },
        {
            label: "Billing & Finance",
            items: [
                { title: "Invoices", icon: Receipt, path: "/hospital/appointment-transactions", roles: ['Admin'], module: 'billing' },
                { title: "Payments", icon: CreditCard, path: "/hospital/unified-billing", roles: ['Admin'], module: 'billing' },
                { title: "Billing Ops", icon: BadgeDollarSign, path: "/hospital/billing", roles: ['Admin'], module: 'billing' },
                { title: "Reports", icon: BarChart3, path: "/hospital/reports/daily-op", roles: ['Admin'], module: 'reports' }
            ]
        },
        {
            label: "Pharmacy & Inventory",
            items: [
                { title: "Pharma Dashboard", icon: LayoutDashboard, path: "/pharmacy/dashboard", roles: ['Admin'], module: 'pharmacy' },
                { title: "Medicine Stock", icon: Pill, path: "/pharmacy/stock-entry", roles: ['Admin'], module: 'pharma_inventory' },
                { title: "Pharma Billing", icon: Receipt, path: "/pharmacy/billing", roles: ['Admin'], module: 'pharma_billing' },
                { title: "Purchase History", icon: ShoppingCart, path: "/pharmacy/reports/purchase", roles: ['Admin'], module: 'pharma_reports' },
                { title: "Expiry Alerts", icon: Activity, path: "/pharmacy/reports/stock", roles: ['Admin'], module: 'pharma_reports' }
            ]
        },
        {
            label: "Laboratory",
            items: [
                { title: "Lab Dashboard", icon: LayoutDashboard, path: "/lab/dashboard", roles: ['Admin'], module: 'lab' },
                { title: "Test Requests", icon: TestTube2, path: "/lab/requests/pending", roles: ['Admin'], module: 'lab' },
                { title: "Test Reports", icon: FileText, path: "/lab-entry/report", roles: ['Admin'], module: 'lab_testing' },
                { title: "Lab Billing", icon: Receipt, path: "/lab-entry/billing", roles: ['Admin'], module: 'lab_billing' },
                { title: "Lab Inventory", icon: Package, path: "/lab/products", roles: ['Admin'], module: 'lab_inventory' }
            ]
        },
        {
            label: "Nurse Station",
            items: [
                { title: "Nurse Dashboard", icon: Heart, path: "/nurse/dashboard", roles: ['Admin'], module: 'nurse' },
                { title: "Ward Indents", icon: Package, path: "/nurse/ward-indent", roles: ['Admin'], module: 'nurse' }
            ]
        },
        {
            label: "Pantry / Dietary",
            items: [
                { title: "Pantry Dashboard", icon: Utensils, path: "/pantry/dashboard", roles: ['Admin'], module: 'pantry' },
                { title: "Food Menu", icon: ClipboardList, path: "/pantry/menu", roles: ['Admin'], module: 'pantry' },
                { title: "Serving History", icon: History, path: "/pantry/history", roles: ['Admin'], module: 'pantry' }
            ]
        }
    ];

    // Filter Logic
    const targetGroups = user?.role === 'Admin' ? adminMenuGroups : menuGroups;

    // Check for Module Access:
    // User has access if:
    // 1. Role matches (handled by existing .filter logic)
    // 2. AND (Item has no module defined OR User is Admin OR User's module_access includes the item's module)

    const filteredGroups = targetGroups.map(group => {
        // Filter out groups where role doesn't match
        if (group.roles && !group.roles.includes(user?.role) && user?.role !== 'Admin') return null;

        const visibleItems = group.items.filter(item => {
            // 1. Role Check
            const roleMatch = !item.roles || (user && item.roles.includes(user.role)) || item.roles.length === 0 || user?.role === 'Admin';
            if (!roleMatch) return false;

            // 2. Module Access Check
            // If item has a module key, check against user.module_access array
            /* 
                Structure of user object expected:
                {
                    ...
                    role: 'RoleName',
                    module_access: ['module1', 'module2', ...] 
                }
            */
            if (user?.role === 'Admin') return true; // Admin bypass

            if (item.module) {
                const userModules = user.module_access || [];
                // Backward compat: parent module grants access to all sub-modules
                const hasAccess = userModules.includes(item.module) ||
                    (item.module.startsWith('pharma_') && userModules.includes('pharmacy')) ||
                    (item.module.startsWith('lab_') && userModules.includes('lab')) ||
                    (item.module === 'ipd' && userModules.includes('reception')) ||
                    (item.module === 'pantry' && user?.role === 'Nurse');
                return hasAccess;
            }

            return true; // No module restriction
        });

        if (visibleItems.length === 0) return null;
        return { ...group, items: visibleItems };
    }).filter(Boolean);

    return (
        <>
            {/* Mobile Overlay */}
            {mobileOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden glass-backdrop"
                    onClick={() => setMobileOpen(false)}
                />
            )}

            <motion.aside
                initial={false}
                animate={{ width: collapsed ? 80 : 280 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                style={{
                    // Inline style for mobile transform — prevents tailwind-merge from stripping it
                    '--sidebar-translate': mobileOpen ? '0%' : '-100%',
                }}
                className={cn(
                    "flex flex-col bg-[#FBFBFB] border-r border-slate-200 text-slate-600 font-sans",
                    // Mobile: Fixed overlay that slides in/out
                    "fixed inset-y-0 left-0 z-50",
                    "transition-transform duration-300 ease-in-out",
                    "[transform:translateX(var(--sidebar-translate))]",
                    // Desktop: Always visible, relative positioning, no transform
                    "md:relative md:h-screen md:!translate-x-0 md:!transform-none md:transition-none"
                )}
            >
                {/* Header */}
                <div className="h-16 flex items-center px-4 border-b border-slate-100 flex-shrink-0">
                    <div
                        className={cn(
                            "flex items-center gap-3 w-full p-2 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer",
                            collapsed && "md:justify-center md:p-0"
                        )}
                    >
                        <div className="h-8 w-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white shrink-0 shadow-sm shadow-indigo-200">
                            <Building2 className="h-5 w-5" />
                        </div>

                        {(!collapsed || mobileOpen) && (
                            <div className="flex-1 text-left min-w-0">
                                <h2 className="text-sm font-bold text-slate-900 truncate">HMS</h2>
                                <p className="text-[10px] text-slate-500 truncate">Hospital Management System</p>
                            </div>
                        )}

                        {(!collapsed || mobileOpen) && (
                            <ChevronsUpDown className="h-4 w-4 text-slate-400 shrink-0" />
                        )}
                    </div>
                </div>

                {/* Search Bar */}
                <div className="px-4 py-4 flex-shrink-0">
                    {(!collapsed || mobileOpen) ? (
                        <div className="w-full">
                            <MasterSearch enableShortcut={false} />
                        </div>
                    ) : (
                        <div className="relative flex items-center justify-center bg-white border border-slate-200 rounded-lg shadow-sm w-10 h-10 cursor-pointer hover:border-indigo-300 transition-colors"
                            onClick={() => setCollapsed(false)}
                        >
                            <Search className="h-5 w-5 text-slate-400" />
                        </div>
                    )}
                </div>

                {/* Navigation */}
                <nav className="flex-1 overflow-y-auto px-4 space-y-6 pt-2 custom-scrollbar">
                    {filteredGroups.map((group, groupIndex) => {
                        const isGroupActive = group.items.some(item => location.pathname.startsWith(item.path));
                        return (
                            <SidebarGroup
                                key={groupIndex}
                                group={group}
                                collapsed={collapsed}
                                mobileOpen={mobileOpen}
                                isActive={isGroupActive}
                            />
                        );
                    })}
                </nav>

                {/* Collapse Toggle */}
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="hidden md:flex absolute -right-3 top-20 bg-white border border-slate-200 rounded-full p-1 shadow-sm hover:bg-slate-50 hover:text-indigo-600 transition-colors z-20"
                >
                    {collapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
                </button>
            </motion.aside>
        </>
    );
};

export default Sidebar;
