import React, { createContext, useContext, useState, useEffect } from 'react';

const PatientContext = createContext();

export const PatientProvider = ({ children }) => {
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const getAuthHeaders = () => {
        const token = localStorage.getItem('token');
        return token
            ? { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }
            : { 'Content-Type': 'application/json' };
    };

    const fetchPatients = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            setLoading(false);
            return; // Don't fetch if not logged in
        }

        try {
            const response = await fetch('/api/patients', {
                headers: getAuthHeaders()
            });
            if (!response.ok) {
                throw new Error('Failed to fetch patients');
            }
            const data = await response.json();
            setPatients(data);
            setError(null);
        } catch (err) {
            console.error(err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPatients();
    }, []);

    const addPatient = async (patient) => {
        try {
            const response = await fetch('/api/patients', {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify(patient)
            });
            if (!response.ok) {
                throw new Error('Failed to add patient');
            }
            const newPatientData = await response.json();
            await fetchPatients(); // Refresh list
            return newPatientData;
        } catch (err) {
            console.error(err);
            setError('Could not add patient');
            return false;
        }
    };

    const updatePatientStatus = async (id, status) => {
        try {
            const response = await fetch(`/api/patients/${id}/status`, {
                method: 'PATCH',
                headers: getAuthHeaders(),
                body: JSON.stringify({ status })
            });
            if (!response.ok) throw new Error('Failed to update status');
            await fetchPatients();
            return true;
        } catch (err) {
            console.error(err);
            return false;
        }
    };

    const getPatientById = (id) => {
        return patients.find(p => p.id === id || p.sno === id);
    };

    return (
        <PatientContext.Provider value={{
            patients,
            addPatient,
            updatePatientStatus,
            getPatientById,
            fetchPatients,
            loading,
            error
        }}>
            {children}
        </PatientContext.Provider>
    );
};

export const usePatients = () => {
    const context = useContext(PatientContext);
    if (!context) {
        throw new Error('usePatients must be used within a PatientProvider');
    }
    return context;
};
