import React, { useState, useEffect } from 'react';
import { Utensils, Search, Plus, Edit, Trash2, CheckCircle, XCircle } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import API from '../../config';

const FoodMenu = () => {
    const { user } = useAuth();
    const isViewOnly = user?.role === 'Admin';
    const [menuItems, setMenuItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [form, setForm] = useState({ meal_time: 'Breakfast', diet_category: 'General', item_name: '', description: '', status: 'Active' });

    useEffect(() => { fetchMenu(); }, []);

    const fetchMenu = async () => {
        try {
            const res = await axios.get(`${API}/pantry/menu`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
            setMenuItems(res.data);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const headers = { Authorization: `Bearer ${localStorage.getItem('token')}` };
            if (editingId) {
                await axios.put(`${API}/pantry/menu/${editingId}`, form, { headers });
            } else {
                await axios.post(`${API}/pantry/menu`, form, { headers });
            }
            setShowForm(false);
            setEditingId(null);
            setForm({ meal_time: 'Breakfast', diet_category: 'General', item_name: '', description: '', status: 'Active' });
            fetchMenu();
        } catch (err) { alert(err.response?.data?.message || 'Error saving menu item'); }
    };

    const handleEdit = (item) => {
        setForm({ ...item });
        setEditingId(item.id);
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this menu item?')) return;
        try {
            await axios.delete(`${API}/pantry/menu/${id}`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
            fetchMenu();
        } catch (err) { alert(err.response?.data?.message || 'Error deleting menu item'); }
    };

    const filteredMenu = menuItems.filter(item =>
        item.item_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.diet_category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const mealColors = {
        Breakfast: 'bg-orange-50 border-orange-200 text-orange-700',
        Lunch: 'bg-yellow-50 border-yellow-200 text-yellow-700',
        Snack: 'bg-pink-50 border-pink-200 text-pink-700',
        Dinner: 'bg-indigo-50 border-indigo-200 text-indigo-700',
        All: 'bg-blue-50 border-blue-200 text-blue-700'
    };

    if (loading) return <div className="flex justify-center p-12"><div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-500 border-t-transparent"></div></div>;

    return (
        <div className="p-6 max-w-[1400px] mx-auto space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2"><Utensils className="h-6 w-6 text-indigo-500" /> Food Menu</h1>
                    <p className="text-sm text-slate-500 mt-1">Manage dietary options and meal items</p>
                </div>
                <div className="flex gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <input type="text" placeholder="Search menu..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500" />
                    </div>
                    {!isViewOnly && (
                        <button onClick={() => { setShowForm(true); setEditingId(null); setForm({ meal_time: 'Breakfast', diet_category: 'General', item_name: '', description: '', status: 'Active' }) }}
                            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700 shadow-md">
                            <Plus className="h-4 w-4" /> Add Item
                        </button>
                    )}
                </div>
            </div>

            {showForm && !isViewOnly && (
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                    <h3 className="text-lg font-bold text-slate-900 mb-4">{editingId ? 'Edit Menu Item' : 'New Menu Item'}</h3>
                    <form onSubmit={handleSubmit} className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="col-span-1">
                            <label className="block text-xs font-semibold text-slate-600 mb-1">Meal Time</label>
                            <select value={form.meal_time} onChange={e => setForm({ ...form, meal_time: e.target.value })} className="w-full p-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500">
                                <option>Breakfast</option><option>Lunch</option><option>Snack</option><option>Dinner</option><option>All</option>
                            </select>
                        </div>
                        <div className="col-span-1">
                            <label className="block text-xs font-semibold text-slate-600 mb-1">Diet Category</label>
                            <input type="text" value={form.diet_category} onChange={e => setForm({ ...form, diet_category: e.target.value })} placeholder="e.g. Diabetic" required className="w-full p-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500" />
                        </div>
                        <div className="col-span-2">
                            <label className="block text-xs font-semibold text-slate-600 mb-1">Item Name</label>
                            <input type="text" value={form.item_name} onChange={e => setForm({ ...form, item_name: e.target.value })} placeholder="e.g. Oats Porridge" required className="w-full p-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500" />
                        </div>
                        <div className="col-span-4 lg:col-span-3">
                            <label className="block text-xs font-semibold text-slate-600 mb-1">Description</label>
                            <input type="text" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Brief details about the food..." className="w-full p-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500" />
                        </div>
                        <div className="col-span-1">
                            <label className="block text-xs font-semibold text-slate-600 mb-1">Status</label>
                            <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} className="w-full p-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500">
                                <option>Active</option><option>Inactive</option>
                            </select>
                        </div>
                        <div className="col-span-full flex justify-end gap-2 mt-2">
                            <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-slate-600 bg-slate-100 rounded-lg text-sm hover:bg-slate-200">Cancel</button>
                            <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700 shadow-md">Save Item</button>
                        </div>
                    </form>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredMenu.map(item => (
                    <div key={item.id} className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow relative group">
                        <div className="flex justify-between items-start mb-3">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${mealColors[item.meal_time]}`}>{item.meal_time}</span>
                            {!isViewOnly && (
                                <div className="hidden group-hover:flex gap-1">
                                    <button onClick={() => handleEdit(item)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><Edit className="h-4 w-4" /></button>
                                    <button onClick={() => handleDelete(item.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"><Trash2 className="h-4 w-4" /></button>
                                </div>
                            )}
                        </div>
                        <h3 className="font-bold text-slate-900 text-lg leading-tight mb-1">{item.item_name}</h3>
                        <p className="text-xs font-semibold text-indigo-600 mb-3">{item.diet_category}</p>
                        <p className="text-sm text-slate-600 line-clamp-2 min-h-[40px] mb-4">{item.description || 'No description provided'}</p>

                        <div className="flex items-center gap-1.5 text-xs font-medium border-t border-slate-100 pt-3">
                            {item.status === 'Active' ? <CheckCircle className="h-4 w-4 text-emerald-500" /> : <XCircle className="h-4 w-4 text-slate-400" />}
                            <span className={item.status === 'Active' ? 'text-emerald-700' : 'text-slate-500'}>{item.status}</span>
                        </div>
                    </div>
                ))}
                {filteredMenu.length === 0 && (
                    <div className="col-span-full py-12 text-center text-slate-400 bg-white rounded-xl border border-slate-200 border-dashed">No menu items found.</div>
                )}
            </div>
        </div>
    );
};

export default FoodMenu;
