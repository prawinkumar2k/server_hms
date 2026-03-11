import React, { useState, useEffect, useRef } from 'react';
import { Search, User, Phone, X } from 'lucide-react';
import { cn } from '../../lib/utils';

const PatientSearch = ({ onSelect, onChange, value, placeholder = "Search Patient (Name, ID, Mobile)", className, autoFocus = false }) => {
    const [query, setQuery] = useState(value || '');
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [loading, setLoading] = useState(false);
    const wrapperRef = useRef(null);

    // Sync external value
    useEffect(() => {
        if (value !== undefined) setQuery(value);
    }, [value]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Debounced Search
    useEffect(() => {
        const delayDebounceFn = setTimeout(async () => {
            if (query.length >= 2) {
                // Prevent searching if the query is a formatted selection result "Name (ID)"
                if (query.includes('(') && query.includes(')')) {
                    setShowSuggestions(false);
                    return;
                }

                setLoading(true);
                try {
                    const res = await fetch(`/api/lab/patients?term=${query}`);
                    if (res.ok) {
                        const data = await res.json();
                        setSuggestions(data);
                        // Only show suggestions if we have results, otherwise let the "No found" block handle it
                        setShowSuggestions(true);
                    }
                } catch (error) {
                    console.error("Search error", error);
                } finally {
                    setLoading(false);
                }
            } else {
                setSuggestions([]);
                setShowSuggestions(false);
            }
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [query]);

    const handleSelect = (patient) => {
        setQuery(`${patient.patientName} (${patient.patientId})`);
        // Force close immediately and clear suggestions to prevent race conditions
        setSuggestions([]);
        setShowSuggestions(false);
        onSelect(patient);
    };

    const clearSearch = () => {
        setQuery('');
        setSuggestions([]);
        onSelect(null);
        if (onChange) onChange('');
    };

    return (
        <div ref={wrapperRef} className={cn("relative w-full", className)}>
            <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                    type="text"
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        if (onChange) onChange(e.target.value);
                    }}
                    onFocus={() => query.length >= 2 && setShowSuggestions(true)}
                    placeholder={placeholder}
                    className="w-full pl-9 pr-8 h-10 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-sm"
                    autoFocus={autoFocus}
                />
                {query && (
                    <button onClick={clearSearch} className="absolute right-2 top-2.5 text-slate-400 hover:text-slate-600">
                        <X className="h-4 w-4" />
                    </button>
                )}
            </div>

            {/* Suggestions Dropdown */}
            {showSuggestions && suggestions.length > 0 && (
                <div className="absolute z-50 w-full mt-1 bg-white rounded-lg shadow-xl border border-slate-100 max-h-60 overflow-y-auto animate-in fade-in zoom-in-95 duration-100">
                    <ul className="py-1 text-sm text-slate-700">
                        {suggestions.map((patient) => (
                            <li
                                key={patient.patientId}
                                onClick={() => handleSelect(patient)}
                                className="px-4 py-3 hover:bg-slate-50 cursor-pointer border-b border-slate-50 last:border-0 flex justify-between items-center group"
                            >
                                <div>
                                    <div className="font-semibold text-slate-900 flex items-center gap-2">
                                        {patient.patientName}
                                        <span className="text-xs font-normal text-slate-500 bg-slate-100 px-1.5 rounded">{patient.patientId}</span>
                                    </div>
                                    <div className="text-xs text-slate-500 flex items-center gap-3 mt-0.5">
                                        <span className="flex items-center gap-1"><Phone className="h-3 w-3" /> {patient.mobile || 'N/A'}</span>
                                        <span>•</span>
                                        <span>{patient.age} Y / {patient.sex}</span>
                                    </div>
                                </div>
                                <User className="h-4 w-4 text-slate-300 group-hover:text-indigo-400 transition-colors" />
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {showSuggestions && query.length >= 2 && suggestions.length === 0 && !loading && (
                <div className="absolute z-50 w-full mt-1 bg-white rounded-lg shadow-lg border border-slate-100 p-4 text-center text-slate-500 text-sm">
                    No patients found.
                </div>
            )}
        </div>
    );
};

export default PatientSearch;
