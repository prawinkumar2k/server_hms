import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Layout from './layouts/DashboardLayout';
import Dashboard from './pages/Dashboard';
import PlaceholderPage from './pages/PlaceholderPage';
import { PatientProvider } from './context/PatientContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';

// Auth Modules
import Login from './pages/public/Login';
import RoleSelection from './pages/public/RoleSelection';
import Landing from './pages/public/Landing';
import Monitoring from './pages/admin/Monitoring';
import ActivityLogs from './pages/admin/ActivityLogs';
import UserList from './pages/dashboard/admin/users/UserList';
import CreateNewUser from './pages/dashboard/admin/users/CreateNewUser';
import EditUser from './pages/dashboard/admin/users/EditUser';
import CreateRole from './pages/dashboard/admin/users/CreateRole';

// Hospital Modules
import Reception from './pages/hospital/Reception';
import Prescription from './pages/hospital/Prescription';
import SmartCards from './pages/hospital/SmartCards';
import Appointments from './pages/hospital/Appointments';
import IPD from './pages/hospital/IPD';
import OPD from './pages/hospital/OPD';
import HospitalPatientList from './pages/hospital/PatientList';
import Billing from './pages/hospital/Billing';
import AppointmentTransactions from './pages/hospital/AppointmentTransactions';
import DoctorDirectory from './pages/hospital/DoctorDirectory';
import DailyOPReport from './pages/hospital/reports/DailyOP';
import Encounters from './pages/hospital/Encounters';
import MedicalRecords from './pages/hospital/MedicalRecords';
import PatientHistory from './pages/hospital/reports/PatientHistory';
import UnifiedBilling from './pages/billing/UnifiedBilling';
import DoctorStatus from './pages/reception/DoctorStatus';
import DoctorProfile from './pages/reception/DoctorProfile';

// Lab Modules
import LabDashboard from './pages/lab/Dashboard';
import TestMaster from './pages/lab-master/TestMaster';
import DoctorEntry from './pages/lab-master/DoctorEntry';
import ProductMaster from './pages/lab/ProductMaster';
import IndentEntry from './pages/lab/IndentEntry';
import ProductIssue from './pages/lab/ProductIssue';
import LabPatients from './pages/lab/LabPatients';
import TestEntry from './pages/lab-entry/TestEntry';
import LabBilling from './pages/lab-entry/LabBilling';
import TestReport from './pages/lab-entry/TestReport';
import PendingLabRequests from './pages/lab/PendingLabRequests';

// Pharmacy Modules
// Pharmacy Modules (Consolidated)
import StockEntry from './pages/pharmacy/StockEntry';
import VendorDetails from './pages/pharmacy/VendorDetails';
import PurchaseEntry from './pages/pharmacy/PurchaseEntry';
import EnquiryDetail from './pages/pharmacy/EnquiryDetail';
import PharmaPatients from './pages/pharmacy/PharmaPatients';
import PharmacyDashboard from './pages/pharmacy/Dashboard';
import PendingPharmaRequests from './pages/pharmacy/PendingPharmaRequests';
import Suppliers from './pages/pharmacy/Suppliers';
import StockOrders from './pages/pharmacy/StockOrders';
import CreateStockOrder from './pages/pharmacy/CreateStockOrder';
import OrderDetails from './pages/pharmacy/OrderDetails';

import PharmacyBilling from './pages/pharmacy/billing/Billing';
import ReturnBilling from './pages/pharmacy/billing/ReturnBilling';
import DailyReport from './pages/pharmacy/billing/reports/DailyReport';
import StockReport from './pages/pharmacy/billing/reports/StockReport';
import PurchaseReport from './pages/pharmacy/billing/reports/PurchaseReport';

import EmployeeMaster from './pages/payroll/EmployeeMaster';
import Attendance from './pages/payroll/Attendance';
import PayrollDashboard from './pages/payroll/Dashboard';
import SalaryDetails from './pages/payroll/SalaryDetails';
import SalaryProcessing from './pages/payroll/SalaryProcessing';

// Doctor Modules
import PatientList from './pages/doctor/PatientList';
import MedicalNotes from './pages/doctor/MedicalNotes';
import LabRequest from './pages/doctor/LabRequest';
import LabResults from './pages/doctor/LabResults';
import PrescriptionList from './pages/doctor/PrescriptionList';
import XrayViewer from './pages/doctor/XrayViewer';
import IPDPatients from './pages/doctor/IPDPatients';
import DoctorRounds from './pages/doctor/DoctorRounds';
import DoctorOrders from './pages/doctor/DoctorOrders';

// Nurse Modules (PLCM)
import NurseDashboard from './pages/nurse/Dashboard';
import VitalsChart from './pages/nurse/VitalsChart';
import Emar from './pages/nurse/Emar';
import WardIndent from './pages/nurse/WardIndent';

// Pantry Module (PLCM)
import PantryDashboard from './pages/pantry/Dashboard';
import FoodMenu from './pages/pantry/FoodMenu';
import ServingHistory from './pages/pantry/ServingHistory';

// IPD Discharge (PLCM)
import DischargeSummary from './pages/ipd/DischargeSummary';

// Protected Route Component with Role Check
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="h-screen w-full flex items-center justify-center bg-slate-50 text-slate-500">Authenticating...</div>;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role) && user.role !== 'Admin') {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Auth Flow */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      {/* <Route path="/login/:role" element={<Login />} /> */}

      {/* 
          DASHBOARD & COMMON LAYOUT 
          Accessible by all authenticated users, but inner routes are protected
      */}
      <Route element={
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      }>
        <Route path="/dashboard" element={<Dashboard />} />



        {/* --- ADMIN ONLY --- */}
        {/* User Management Sub-routes */}
        <Route path="admin/users/list" element={<ProtectedRoute allowedRoles={['Admin']}><UserList /></ProtectedRoute>} />
        <Route path="admin/users/create" element={<ProtectedRoute allowedRoles={['Admin']}><CreateNewUser /></ProtectedRoute>} />
        <Route path="admin/users/edit/:id" element={<ProtectedRoute allowedRoles={['Admin']}><EditUser /></ProtectedRoute>} />
        <Route path="admin/roles/create" element={<ProtectedRoute allowedRoles={['Admin']}><CreateRole /></ProtectedRoute>} />
        <Route path="admin/monitoring" element={
          <ProtectedRoute allowedRoles={['Admin']}>
            <Monitoring />
          </ProtectedRoute>
        } />
        <Route path="admin/logs" element={
          <ProtectedRoute allowedRoles={['Admin']}>
            <ActivityLogs />
          </ProtectedRoute>
        } />



        {/* --- RECEPTIONIST --- */}
        {/* Includes Registration, Appointments, Billing, Smart Cards */}
        <Route path="hospital/reception" element={<ProtectedRoute allowedRoles={['Receptionist', 'Admin']}><Reception /></ProtectedRoute>} />
        <Route path="hospital/patient-list" element={<ProtectedRoute allowedRoles={['Receptionist', 'Admin']}><HospitalPatientList /></ProtectedRoute>} />
        <Route path="hospital/appointments" element={<ProtectedRoute allowedRoles={['Receptionist', 'Doctor', 'Admin']}><Appointments /></ProtectedRoute>} />
        <Route path="hospital/smart-cards" element={<ProtectedRoute allowedRoles={['Receptionist', 'Admin']}><SmartCards /></ProtectedRoute>} />
        <Route path="hospital/billing" element={<ProtectedRoute allowedRoles={['Receptionist', 'Accountant', 'Admin']}><Billing /></ProtectedRoute>} />
        <Route path="hospital/unified-billing" element={<ProtectedRoute allowedRoles={['Receptionist', 'Accountant', 'Admin']}><UnifiedBilling /></ProtectedRoute>} />
        <Route path="hospital/appointment-transactions" element={<ProtectedRoute allowedRoles={['Receptionist', 'Accountant', 'Admin']}><AppointmentTransactions /></ProtectedRoute>} />
        <Route path="hospital/doctor-directory" element={<ProtectedRoute allowedRoles={['Receptionist', 'Admin', 'Doctor']}><DoctorDirectory /></ProtectedRoute>} />
        <Route path="hospital/reports/daily-op" element={<ProtectedRoute allowedRoles={['Receptionist', 'Admin', 'Doctor']}><DailyOPReport /></ProtectedRoute>} />
        <Route path="reception/doctors" element={<ProtectedRoute allowedRoles={['Receptionist', 'Admin']}><DoctorStatus /></ProtectedRoute>} />
        <Route path="reception/doctors/:id" element={<ProtectedRoute allowedRoles={['Receptionist', 'Admin']}><DoctorProfile /></ProtectedRoute>} />


        {/* --- DOCTOR --- */}
        {/* Medical Records, Prescriptions, IPD/OPD clinical views */}
        <Route path="doctor/consultations" element={<ProtectedRoute allowedRoles={['Doctor', 'Admin']}><PatientList /></ProtectedRoute>} />
        <Route path="doctor/notes/:visitId" element={<ProtectedRoute allowedRoles={['Doctor', 'Admin']}><MedicalNotes /></ProtectedRoute>} />
        <Route path="doctor/lab-request" element={<ProtectedRoute allowedRoles={['Doctor', 'Admin']}><LabRequest /></ProtectedRoute>} />
        <Route path="doctor/lab-results" element={<ProtectedRoute allowedRoles={['Doctor', 'Admin']}><LabResults /></ProtectedRoute>} />
        <Route path="doctor/prescriptions" element={<ProtectedRoute allowedRoles={['Doctor', 'Admin']}><PrescriptionList /></ProtectedRoute>} />
        <Route path="doctor/xray/:studyId" element={<ProtectedRoute allowedRoles={['Doctor', 'Admin']}><XrayViewer /></ProtectedRoute>} />

        <Route path="hospital/prescription" element={<ProtectedRoute allowedRoles={['Doctor', 'Admin']}><Prescription /></ProtectedRoute>} />
        <Route path="hospital/ipd" element={<ProtectedRoute allowedRoles={['Doctor', 'Nurse', 'Receptionist', 'Admin']}><IPD /></ProtectedRoute>} />
        <Route path="hospital/opd" element={<ProtectedRoute allowedRoles={['Doctor', 'Receptionist', 'Admin']}><OPD /></ProtectedRoute>} />
        <Route path="hospital/medical-records" element={<ProtectedRoute allowedRoles={['Doctor', 'Receptionist', 'Admin']}><MedicalRecords /></ProtectedRoute>} />
        <Route path="hospital/encounters" element={<ProtectedRoute allowedRoles={['Doctor', 'Admin']}><Encounters /></ProtectedRoute>} />
        <Route path="hospital/reports/patient-history" element={<ProtectedRoute allowedRoles={['Doctor', 'Admin']}><PatientHistory /></ProtectedRoute>} />

        {/* --- DOCTOR IPD (PLCM) --- */}
        <Route path="doctor/ipd-patients" element={<ProtectedRoute allowedRoles={['Doctor', 'Admin']}><IPDPatients /></ProtectedRoute>} />
        <Route path="doctor/rounds/:admissionId" element={<ProtectedRoute allowedRoles={['Doctor', 'Admin']}><DoctorRounds /></ProtectedRoute>} />
        <Route path="doctor/orders/:admissionId" element={<ProtectedRoute allowedRoles={['Doctor', 'Admin']}><DoctorOrders /></ProtectedRoute>} />

        {/* --- NURSE STATION (PLCM) --- */}
        <Route path="nurse" element={<Navigate to="/nurse/dashboard" replace />} />
        <Route path="nurse/dashboard" element={<ProtectedRoute allowedRoles={['Nurse', 'Admin']}><NurseDashboard /></ProtectedRoute>} />
        <Route path="nurse/vitals/:admissionId" element={<ProtectedRoute allowedRoles={['Nurse', 'Doctor', 'Admin']}><VitalsChart /></ProtectedRoute>} />
        <Route path="nurse/emar/:admissionId" element={<ProtectedRoute allowedRoles={['Nurse', 'Admin']}><Emar /></ProtectedRoute>} />
        <Route path="nurse/ward-indent" element={<ProtectedRoute allowedRoles={['Nurse', 'Admin']}><WardIndent /></ProtectedRoute>} />

        {/* --- PANTRY (PLCM) --- */}
        <Route path="pantry" element={<Navigate to="/pantry/dashboard" replace />} />
        <Route path="pantry/dashboard" element={<ProtectedRoute allowedRoles={['Pantry', 'Nurse', 'Admin']}><PantryDashboard /></ProtectedRoute>} />
        <Route path="pantry/menu" element={<ProtectedRoute allowedRoles={['Pantry', 'Nurse', 'Admin']}><FoodMenu /></ProtectedRoute>} />
        <Route path="pantry/history" element={<ProtectedRoute allowedRoles={['Pantry', 'Nurse', 'Admin']}><ServingHistory /></ProtectedRoute>} />

        {/* --- IPD DISCHARGE (PLCM) --- */}
        <Route path="ipd/discharge/:admissionId" element={<ProtectedRoute allowedRoles={['Doctor', 'Nurse', 'Admin']}><DischargeSummary /></ProtectedRoute>} />


        {/* --- PHARMACY (Consolidated) --- */}
        {/* Unified Dashboard & Core Modules */}
        <Route path="pharmacy/*" element={<ProtectedRoute allowedRoles={['Pharmacist', 'PHARMA_MASTER', 'Admin']}><PharmacyDashboard /></ProtectedRoute>} />
        <Route path="pharmacy/dashboard" element={<ProtectedRoute allowedRoles={['Pharmacist', 'PHARMA_MASTER', 'Admin']}><PharmacyDashboard /></ProtectedRoute>} />

        <Route path="pharmacy/patient-details" element={<ProtectedRoute allowedRoles={['Pharmacist', 'PHARMA_MASTER', 'Admin']}><PharmaPatients /></ProtectedRoute>} />
        <Route path="pharmacy/vendor-details" element={<ProtectedRoute allowedRoles={['Pharmacist', 'PHARMA_MASTER', 'Admin']}><VendorDetails /></ProtectedRoute>} />
        <Route path="pharmacy/stock-entry" element={<ProtectedRoute allowedRoles={['Pharmacist', 'PHARMA_MASTER', 'Admin']}><StockEntry /></ProtectedRoute>} />
        <Route path="pharmacy/purchase-entry" element={<ProtectedRoute allowedRoles={['Pharmacist', 'PHARMA_MASTER', 'Admin']}><PurchaseEntry /></ProtectedRoute>} />
        <Route path="pharmacy/enquiry-entry" element={<ProtectedRoute allowedRoles={['Pharmacist', 'PHARMA_MASTER', 'Admin']}><EnquiryDetail /></ProtectedRoute>} />
        <Route path="pharmacy/requests/pending" element={<ProtectedRoute allowedRoles={['Pharmacist', 'PHARMA_MASTER', 'Admin']}><PendingPharmaRequests /></ProtectedRoute>} />

        {/* Billing Section */}
        <Route path="pharmacy/billing" element={<ProtectedRoute allowedRoles={['Pharmacist', 'PHARMA_MASTER', 'Admin']}><PharmacyBilling /></ProtectedRoute>} />
        <Route path="pharmacy/billing/return" element={<ProtectedRoute allowedRoles={['Pharmacist', 'PHARMA_MASTER', 'Admin']}><ReturnBilling /></ProtectedRoute>} />

        {/* Reports Section */}
        <Route path="pharmacy/reports/stock" element={<ProtectedRoute allowedRoles={['Pharmacist', 'PHARMA_MASTER', 'Admin']}><StockReport /></ProtectedRoute>} />
        <Route path="pharmacy/reports/purchase" element={<ProtectedRoute allowedRoles={['Pharmacist', 'PHARMA_MASTER', 'Admin']}><PurchaseReport /></ProtectedRoute>} />
        <Route path="pharmacy/reports/daily" element={<ProtectedRoute allowedRoles={['Pharmacist', 'PHARMA_MASTER', 'Admin']}><DailyReport /></ProtectedRoute>} />

        {/* Procurement / Master Section (Formerly Pharma Master) */}
        <Route path="pharmacy/suppliers" element={<ProtectedRoute allowedRoles={['Pharmacist', 'PHARMA_MASTER', 'Admin']}><Suppliers /></ProtectedRoute>} />
        <Route path="pharmacy/stock-orders" element={<ProtectedRoute allowedRoles={['Pharmacist', 'PHARMA_MASTER', 'Admin']}><StockOrders /></ProtectedRoute>} />
        <Route path="pharmacy/orders/create" element={<ProtectedRoute allowedRoles={['Pharmacist', 'PHARMA_MASTER', 'Admin']}><CreateStockOrder /></ProtectedRoute>} />
        <Route path="pharmacy/orders/:id" element={<ProtectedRoute allowedRoles={['Pharmacist', 'PHARMA_MASTER', 'Admin']}><OrderDetails /></ProtectedRoute>} />


        {/* --- LAB TECHNICIAN --- */}
        <Route path="lab" element={<Navigate to="/lab/dashboard" replace />} />
        <Route path="lab/dashboard" element={<ProtectedRoute allowedRoles={['Lab Technician', 'LAB_MASTER', 'Admin']}><LabDashboard /></ProtectedRoute>} />
        <Route path="lab/patients" element={<ProtectedRoute allowedRoles={['Lab Technician', 'LAB_MASTER', 'Admin']}><LabPatients /></ProtectedRoute>} />
        <Route path="lab/products" element={<ProtectedRoute allowedRoles={['Lab Technician', 'LAB_MASTER', 'Admin']}><ProductMaster /></ProtectedRoute>} />
        <Route path="lab/indents" element={<ProtectedRoute allowedRoles={['Lab Technician', 'LAB_MASTER', 'Admin']}><IndentEntry /></ProtectedRoute>} />
        <Route path="lab/issues" element={<ProtectedRoute allowedRoles={['Lab Technician', 'LAB_MASTER', 'Admin']}><ProductIssue /></ProtectedRoute>} />
        <Route path="lab/requests/pending" element={<ProtectedRoute allowedRoles={['Lab Technician', 'LAB_MASTER', 'Admin']}><PendingLabRequests /></ProtectedRoute>} />

        <Route path="lab-master" element={<Navigate to="/lab-master/test-master" replace />} />
        <Route path="lab-master/test-master" element={<ProtectedRoute allowedRoles={['Lab Technician', 'LAB_MASTER', 'Admin']}><TestMaster /></ProtectedRoute>} />
        <Route path="lab-master/doctor-entry" element={<ProtectedRoute allowedRoles={['Lab Technician', 'LAB_MASTER', 'Admin']}><DoctorEntry /></ProtectedRoute>} />

        <Route path="lab-entry" element={<Navigate to="/lab-entry/test-entry" replace />} />
        <Route path="lab-entry/test-entry" element={<ProtectedRoute allowedRoles={['Lab Technician', 'Admin']}><TestEntry /></ProtectedRoute>} />
        <Route path="lab-entry/billing" element={<ProtectedRoute allowedRoles={['Lab Technician', 'Admin']}><LabBilling /></ProtectedRoute>} />
        <Route path="lab-entry/report" element={<ProtectedRoute allowedRoles={['Lab Technician', 'Doctor', 'Admin']}><TestReport /></ProtectedRoute>} />


        {/* --- PAYROLL HUB (New) --- */}
        <Route path="payroll" element={<Navigate to="/payroll/dashboard" replace />} />
        <Route path="payroll/dashboard" element={<ProtectedRoute allowedRoles={['Admin', 'HR']}><PayrollDashboard /></ProtectedRoute>} />
        <Route path="payroll/employees" element={<ProtectedRoute allowedRoles={['Admin', 'HR']}><EmployeeMaster /></ProtectedRoute>} />
        <Route path="payroll/attendance" element={<ProtectedRoute allowedRoles={['Admin', 'HR']}><Attendance /></ProtectedRoute>} />
        <Route path="payroll/salaries" element={<ProtectedRoute allowedRoles={['Admin', 'HR']}><SalaryDetails /></ProtectedRoute>} />
        <Route path="payroll/process" element={<ProtectedRoute allowedRoles={['Admin', 'HR']}><SalaryProcessing /></ProtectedRoute>} />

        {/* SHARED / FALLBACKS */}
        <Route path="file/help" element={<PlaceholderPage title="Help" />} />

      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <PatientProvider>
        <ToastProvider>
          <Router>
            <AppRoutes />
          </Router>
        </ToastProvider>
      </PatientProvider>
    </AuthProvider>
  );
}

export default App;
