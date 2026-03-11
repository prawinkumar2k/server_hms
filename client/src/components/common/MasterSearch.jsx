import React, { useState, useEffect, useRef } from 'react';
import { Search, X, ChevronRight, User, Stethoscope, Calendar, Pill, FileText, AlertCircle } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const MasterSearch = ({ className, enableShortcut = true }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [query, setQuery] = useState('');
    const [results, setResults] = useState({});
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const searchRef = useRef(null);
    const inputRef = useRef(null);

    // Determine Context based on Page
    const getSearchContext = () => {
        const path = location.pathname;
        // Procurement
        if (path.includes('suppliers')) return 'suppliers';
        if (path.includes('orders')) return 'stock_orders';

        // Pharmacy
        if (path.includes('pharmacy') && path.includes('stock')) return 'medicines';
        if (path.includes('pharmacy') && path.includes('billing')) return 'patients';

        // Doctor
        if (path.includes('doctor') && path.includes('prescriptions')) return 'prescriptions';
        if (path.includes('doctor') && path.includes('lab')) return 'lab_reports';
        if (path.includes('consultations')) return 'patients';

        // Hospital / Reception
        if (path.includes('appointments')) return 'appointments';
        if (path.includes('reception/doctors')) return 'doctors';
        if (path.includes('patients') || path.includes('billing')) return 'patients';

        // Admin
        if (path.includes('user-details')) return 'users';

        // Lab
        if (path.includes('lab') && path.includes('test')) return 'lab_tests';

        return ''; // Global - searches everything allowed
    };

    // Placeholder Logic
    const getPlaceholder = () => {
        const ctx = getSearchContext();
        if (ctx === 'suppliers') return 'Search suppliers...';
        if (ctx === 'stock_orders') return 'Search orders (PO#)...';
        if (ctx === 'medicines') return 'Search medicines...';
        if (ctx === 'prescriptions') return 'Search prescriptions (Patient/ID)...';
        if (ctx === 'lab_tests') return 'Search lab tests...';
        if (ctx === 'users') return 'Search staff users...';
        if (ctx === 'patients') return 'Search patients...';
        if (ctx === 'appointments') return 'Search appointments...';
        if (ctx === 'doctors') return 'Search doctors...';
        return "Search patients, doctors, records... (Ctrl+K)";
    };

    // Debounce Logic
    useEffect(() => {
        const timer = setTimeout(() => {
            if (query.length >= 1) {
                performSearch(query);
            } else if (query.length === 0 && document.activeElement === inputRef.current) {
                // User cleared the box but is still focused -> Show Recent
                performSearch('');
            } else {
                setResults({});
                setOpen(false);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [query]);

    // Keyboard Shortcuts
    useEffect(() => {
        if (!enableShortcut) return;

        const handleKeyDown = (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                inputRef.current?.focus();
            }
            if (e.key === 'Escape') {
                setOpen(false);
                inputRef.current?.blur();
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [enableShortcut]);

    // Click Outside to Close
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const performSearch = async (searchTerm) => {
        setLoading(true);
        setOpen(true);
        try {
            const token = localStorage.getItem('token');
            const context = getSearchContext();
            const url = `/api/search?q=${encodeURIComponent(searchTerm)}${context ? `&type=${context}` : ''}`;

            const res = await fetch(url, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setResults(data);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleSelect = (path) => {
        navigate(path);
        setOpen(false);
        setQuery('');
    };

    const hasResults = Object.keys(results).length > 0;

    return (
        <div className={`relative w-full max-w-md ${className || ''}`} ref={searchRef}>
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => {
                        if (query.length === 0) performSearch('');
                        else if (query.length >= 2) setOpen(true);
                    }}
                    placeholder={getPlaceholder()}
                    className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:bg-white transition-all shadow-sm"
                />
                {query && (
                    <button
                        onClick={() => { setQuery(''); setOpen(false); inputRef.current?.focus(); }}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                        <X className="h-4 w-4" />
                    </button>
                )}
            </div>

            {open && (
                <div className="absolute top-full mt-2 left-0 w-full bg-white rounded-xl shadow-2xl border border-slate-100 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200">
                    {loading ? (
                        <div className="p-4 text-center text-slate-400 text-sm flex items-center justify-center gap-2">
                            <div className="w-4 h-4 border-2 border-slate-200 border-t-indigo-600 rounded-full animate-spin" />
                            Searching HMS...
                        </div>
                    ) : !hasResults ? (
                        <div className="p-8 text-center text-slate-500">
                            <AlertCircle className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                            <p className="text-sm">No results found for "{query}"</p>
                        </div>
                    ) : (
                        <div className="max-h-[70vh] overflow-y-auto">
                            {/* Patients */}
                            {results.patients && (
                                <div className="py-2">
                                    <h3 className="px-4 py-1 text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                                        <User className="w-3 h-3" /> Patients
                                    </h3>
                                    {results.patients.map(p => (
                                        <div
                                            key={p.id}
                                            onClick={() => handleSelect(`/hospital/patients/${p.id}`)}
                                            className="px-4 py-2 hover:bg-slate-50 cursor-pointer flex items-center justify-between group border-l-2 border-transparent hover:border-indigo-500"
                                        >
                                            <div>
                                                <p className="text-sm font-medium text-slate-800 group-hover:text-indigo-700">{p.full_name}</p>
                                                <p className="text-xs text-slate-500">{p.gender}, {p.age}y • {p.mobile}</p>
                                            </div>
                                            <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-400" />
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Doctors */}
                            {results.doctors && (
                                <div className="py-2 border-t border-slate-50">
                                    <h3 className="px-4 py-1 text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                                        <Stethoscope className="w-3 h-3" /> Doctors
                                    </h3>
                                    {results.doctors.map(d => (
                                        <div
                                            key={d.id}
                                            onClick={() => handleSelect(`/reception/doctors/${d.id}`)}
                                            className="px-4 py-2 hover:bg-slate-50 cursor-pointer flex items-center justify-between group border-l-2 border-transparent hover:border-purple-500"
                                        >
                                            <div>
                                                <p className="text-sm font-medium text-slate-800 group-hover:text-purple-700">{d.full_name}</p>
                                                <p className="text-xs text-slate-500">{d.department} • {d.availability_status}</p>
                                            </div>
                                            <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-purple-400" />
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Appointments */}
                            {results.appointments && (
                                <div className="py-2 border-t border-slate-50">
                                    <h3 className="px-4 py-1 text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                                        <Calendar className="w-3 h-3" /> Appointments
                                    </h3>
                                    {results.appointments.map(a => (
                                        <div
                                            key={a.id}
                                            onClick={() => handleSelect(`/hospital/appointments`)}
                                            className="px-4 py-2 hover:bg-slate-50 cursor-pointer flex items-center justify-between group border-l-2 border-transparent hover:border-blue-500"
                                        >
                                            <div>
                                                <p className="text-sm font-medium text-slate-800 group-hover:text-blue-700">
                                                    {new Date(a.visit_date).toLocaleDateString()}
                                                </p>
                                                <p className="text-xs text-slate-500">
                                                    {a.patient_name} with {a.doctor_name}
                                                </p>
                                            </div>
                                            <span className="text-[10px] px-1.5 py-0.5 bg-slate-100 rounded text-slate-600">{a.status}</span>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Medicines */}
                            {results.medicines && (
                                <div className="py-2 border-t border-slate-50">
                                    <h3 className="px-4 py-1 text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                                        <Pill className="w-3 h-3" /> Medicines
                                    </h3>
                                    {results.medicines.map(m => (
                                        <div
                                            key={m.id}
                                            onClick={() => handleSelect(`/pharmacy/stock-entry`)}
                                            className="px-4 py-2 hover:bg-slate-50 cursor-pointer flex items-center justify-between group border-l-2 border-transparent hover:border-emerald-500"
                                        >
                                            <div>
                                                <p className="text-sm font-medium text-slate-800 group-hover:text-emerald-700">
                                                    {m.name}
                                                </p>
                                                <p className="text-xs text-slate-500 truncate max-w-[200px]">
                                                    {m.description || 'No Category'}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-xs font-bold text-emerald-600">Qty: {m.stock}</p>
                                                <p className="text-[10px] text-slate-400">₹{m.price}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Suppliers */}
                            {results.suppliers && (
                                <div className="py-2 border-t border-slate-50">
                                    <h3 className="px-4 py-1 text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                                        <User className="w-3 h-3" /> Suppliers
                                    </h3>
                                    {results.suppliers.map(s => (
                                        <div
                                            key={s.id}
                                            onClick={() => handleSelect(`/pharma-master/suppliers`)}
                                            className="px-4 py-2 hover:bg-slate-50 cursor-pointer flex items-center justify-between group border-l-2 border-transparent hover:border-orange-500"
                                        >
                                            <div>
                                                <p className="text-sm font-medium text-slate-800 group-hover:text-orange-700">{s.supplier_name}</p>
                                                <p className="text-xs text-slate-500">{s.contact_person}</p>
                                            </div>
                                            <p className="text-xs text-slate-400">{s.phone}</p>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Stock Orders */}
                            {results.stock_orders && (
                                <div className="py-2 border-t border-slate-50">
                                    <h3 className="px-4 py-1 text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                                        <FileText className="w-3 h-3" /> Stock Orders
                                    </h3>
                                    {results.stock_orders.map(o => (
                                        <div
                                            key={o.id}
                                            onClick={() => handleSelect(`/pharma-master/orders/${o.id}`)}
                                            className="px-4 py-2 hover:bg-slate-50 cursor-pointer flex items-center justify-between group border-l-2 border-transparent hover:border-blue-500"
                                        >
                                            <div>
                                                <p className="text-sm font-medium text-slate-800 group-hover:text-blue-700">{o.order_number}</p>
                                                <p className="text-xs text-slate-500">{o.supplier_name}</p>
                                            </div>
                                            <span className="text-[10px] px-1.5 py-0.5 bg-slate-100 rounded text-slate-600 uppercase">{o.order_status}</span>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Prescriptions */}
                            {results.prescriptions && (
                                <div className="py-2 border-t border-slate-50">
                                    <h3 className="px-4 py-1 text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                                        <FileText className="w-3 h-3" /> Prescriptions
                                    </h3>
                                    {results.prescriptions.map(p => (
                                        <div
                                            key={p.id}
                                            onClick={() => handleSelect(`/doctor/prescriptions`)}
                                            className="px-4 py-2 hover:bg-slate-50 cursor-pointer flex items-center justify-between group border-l-2 border-transparent hover:border-indigo-500"
                                        >
                                            <div>
                                                <p className="text-sm font-medium text-slate-800 group-hover:text-indigo-700">Rx #{p.id}</p>
                                                <p className="text-xs text-slate-500">{p.cusName} • {new Date(p.date).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Lab Tests */}
                            {results.lab_tests && (
                                <div className="py-2 border-t border-slate-50">
                                    <h3 className="px-4 py-1 text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                                        <Stethoscope className="w-3 h-3" /> Lab Tests
                                    </h3>
                                    {results.lab_tests.map(t => (
                                        <div
                                            key={t.TestCode}
                                            onClick={() => handleSelect(`/lab-master/test-master`)}
                                            className="px-4 py-2 hover:bg-slate-50 cursor-pointer flex items-center justify-between group border-l-2 border-transparent hover:border-pink-500"
                                        >
                                            <div>
                                                <p className="text-sm font-medium text-slate-800 group-hover:text-pink-700">{t.TestName}</p>
                                                <p className="text-xs text-slate-500">{t.Investigation}</p>
                                            </div>
                                            <p className="text-xs font-bold text-slate-600">₹{t.Amount}</p>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Users */}
                            {results.users && (
                                <div className="py-2 border-t border-slate-50">
                                    <h3 className="px-4 py-1 text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                                        <User className="w-3 h-3" /> Users
                                    </h3>
                                    {results.users.map(u => (
                                        <div
                                            key={u.id}
                                            onClick={() => handleSelect(`/file/user-details`)}
                                            className="px-4 py-2 hover:bg-slate-50 cursor-pointer flex items-center justify-between group border-l-2 border-transparent hover:border-slate-500"
                                        >
                                            <div>
                                                <p className="text-sm font-medium text-slate-800 group-hover:text-slate-900">{u.full_name}</p>
                                                <p className="text-xs text-slate-500">@{u.username} • {u.role}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                        </div>
                    )}

                    {/* Enter to Search All Hint */}
                    <div className="bg-slate-50 p-2 text-center border-t border-slate-100">
                        <span className="text-[10px] text-slate-400">
                            Press <strong>Esc</strong> to close
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MasterSearch;
