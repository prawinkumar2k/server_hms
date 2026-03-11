import React, { useState, useEffect, useRef } from 'react';
import { Search, AlertCircle, Check, X } from 'lucide-react';

const MedicineSearch = ({
    value,
    onChange,
    onSelect,
    products = [],
    placeholder = "Search Medicine...",
    className = ""
}) => {
    const [suggestions, setSuggestions] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [activeIndex, setActiveIndex] = useState(-1);
    const [isValid, setIsValid] = useState(true);
    const wrapperRef = useRef(null);
    const inputRef = useRef(null);

    // Filter suggestions when value changes
    useEffect(() => {
        if (!value) {
            setSuggestions([]);
            setIsValid(true); // Empty is valid (reset)
            return;
        }

        const filtered = products.filter(p =>
            p.ProductName.toLowerCase().includes(value.toLowerCase())
        ).slice(0, 10); // Limit to 10

        setSuggestions(filtered);

        // Exact match check for validation visual
        const exactMatch = products.find(p => p.ProductName.toLowerCase() === value.toLowerCase());
        setIsValid(!!exactMatch);

    }, [value, products]);

    // Handle Click Outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleChange = (e) => {
        const newValue = e.target.value;
        onChange(newValue);
        setShowDropdown(true);
        setActiveIndex(-1);
    };

    const handleKeyDown = (e) => {
        if (e.key === "ArrowDown") {
            e.preventDefault();
            setActiveIndex(prev => (prev < suggestions.length - 1 ? prev + 1 : prev));
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setActiveIndex(prev => (prev > 0 ? prev - 1 : -1));
        } else if (e.key === "Enter") {
            e.preventDefault();
            if (activeIndex >= 0 && suggestions[activeIndex]) {
                handleSelect(suggestions[activeIndex]);
            }
        } else if (e.key === "Escape") {
            setShowDropdown(false);
        }
    };

    const handleSelect = (item) => {
        onSelect(item); // Parent updates value
        setShowDropdown(false);
        setIsValid(true);
        inputRef.current?.blur();
    };

    const clearInput = () => {
        onChange('');
        inputRef.current?.focus();
    };

    return (
        <div className={`relative ${className}`} ref={wrapperRef}>
            <div className="relative">
                <input
                    ref={inputRef}
                    type="text"
                    className={`w-full p-2 pr-8 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-primary-500 transition-colors ${!isValid && value ? 'border-amber-300 bg-amber-50' : 'border-slate-200'
                        }`}
                    placeholder={placeholder}
                    value={value}
                    onChange={handleChange}
                    onFocus={() => { if (value) setShowDropdown(true); }}
                    onKeyDown={handleKeyDown}
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400">
                    {value && (
                        <button onClick={clearInput} className="hover:text-slate-600">
                            {isValid ? <Check className="h-3 w-3 text-green-500" /> : <AlertCircle className="h-3 w-3 text-amber-500" />}
                        </button>
                    )}
                </div>
            </div>

            {/* Validation Message */}
            {!isValid && value && !showDropdown && (
                <div className="absolute top-full left-0 mt-1 text-[10px] text-amber-600 flex items-center bg-white px-1 shadow-sm border border-amber-100 rounded z-10">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    Select a valid medicine from list
                </div>
            )}

            {/* Suggestions Dropdown */}
            {showDropdown && suggestions.length > 0 && (
                <ul className="absolute z-50 w-full bg-white border border-slate-200 rounded-md shadow-lg mt-1 max-h-60 overflow-y-auto animate-in fade-in zoom-in-95 duration-100">
                    {suggestions.map((item, index) => (
                        <li
                            key={item.Pcode || index}
                            className={`px-3 py-2 text-sm cursor-pointer flex justify-between items-center ${index === activeIndex ? 'bg-indigo-50 text-indigo-700' : 'text-slate-700 hover:bg-slate-50'
                                }`}
                            onClick={() => handleSelect(item)}
                            onMouseEnter={() => setActiveIndex(index)}
                        >
                            <span>{item.ProductName}</span>
                            <span className="text-[10px] text-slate-400 bg-slate-100 px-1 rounded">
                                Stock: {item.Stock}
                            </span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default MedicineSearch;
