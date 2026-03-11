import React from 'react';
import { useAuth } from '../context/AuthContext';
import AdminDashboard from './admin/Dashboard';
import DoctorDashboard from './doctor/Dashboard';
import PharmacyDashboard from './pharmacy/Dashboard';
import LabDashboard from './lab/Dashboard';
import ReceptionDashboard from './reception/Dashboard';

const Dashboard = () => {
    const { user } = useAuth();
    const role = user?.role;

    if (role === 'Admin' || role === 'Super Admin') return <AdminDashboard />;
    if (role === 'Doctor') return <DoctorDashboard />;
    if (role === 'Pharmacist' || role === 'PHARMA_MASTER') return <PharmacyDashboard />;
    if (role === 'Lab Technician' || role === 'LAB_MASTER') return <LabDashboard />;
    if (role === 'Receptionist') return <ReceptionDashboard />;

    // Fallback for unassigned or guest users
    return <AdminDashboard />;
};

export default Dashboard;
