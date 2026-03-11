import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown } from 'lucide-react';

const Autocomplete = ({
    value,
    onChange,
    onSelect,
    placeholder,
    icon: Icon,
    fetchSuggestions,
    name,
    className = ""
}) => {
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [loading, setLoading] = useState(false);
    const wrapperRef = useRef(null);

    // Close suggestions when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Fetch suggestions when value changes
    useEffect(() => {
        const loadSuggestions = async () => {
            if (value && value.length >= 1) {
                setLoading(true);
                try {
                    const results = await fetchSuggestions(value);
                    setSuggestions(results);
                    setShowSuggestions(true);
                } catch (error) {
                    console.error('Error fetching suggestions:', error);
                    setSuggestions([]);
                } finally {
                    setLoading(false);
                }
            } else {
                setSuggestions([]);
                setShowSuggestions(false);
            }
        };

        const debounceTimer = setTimeout(loadSuggestions, 300);
        return () => clearTimeout(debounceTimer);
    }, [value, fetchSuggestions]);

    const handleSelect = (suggestion) => {
        onSelect(suggestion);
        setShowSuggestions(false);
        setSuggestions([]);
    };

    return (
        <div ref={wrapperRef} className="relative">
            <div className="relative">
                {Icon && <Icon className="absolute left-3 top-3 h-4 w-4 text-slate-400" />}
                <input
                    type="text"
                    name={name}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    onFocus={() => {
                        if (suggestions.length > 0) {
                            setShowSuggestions(true);
                        }
                    }}
                    className={`${Icon ? 'pl-9' : 'px-3'} ${className}`}
                    placeholder={placeholder}
                    autoComplete="off"
                />
                {loading && (
                    <div className="absolute right-3 top-3">
                        <div className="animate-spin h-4 w-4 border-2 border-primary-500 border-t-transparent rounded-full"></div>
                    </div>
                )}
            </div>

            {/* Suggestions Dropdown */}
            {showSuggestions && suggestions.length > 0 && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-xl shadow-lg max-h-60 overflow-y-auto">
                    {suggestions.map((suggestion, index) => (
                        <button
                            key={index}
                            type="button"
                            onClick={() => handleSelect(suggestion)}
                            className="w-full px-4 py-3 text-left hover:bg-primary-50 focus:bg-primary-50 focus:outline-none transition-colors border-b border-slate-100 last:border-b-0"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="font-medium text-slate-900">{suggestion.name}</div>
                                    {suggestion.specialization && (
                                        <div className="text-xs text-slate-500 mt-0.5">{suggestion.specialization}</div>
                                    )}
                                </div>
                                {suggestion.department && (
                                    <span className="text-xs text-slate-400">{suggestion.department}</span>
                                )}
                            </div>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Autocomplete;
