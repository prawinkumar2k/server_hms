const pantryService = require('./pantry.service');

exports.getDashboard = async (req, res) => {
    try {
        const data = await pantryService.getDashboard(req.query.date);
        res.json(data);
    } catch (err) {
        console.error('PantryDashboard Error:', err);
        res.status(500).json({ message: err.message });
    }
};

exports.updateMealStatus = async (req, res) => {
    try {
        const result = await pantryService.updateMealStatus(req.params.id, req.body.status, req.user.id);
        res.json({ message: 'Meal status updated', ...result });
    } catch (err) {
        console.error('UpdateMealStatus Error:', err);
        res.status(500).json({ message: err.message });
    }
};

exports.bulkMarkDelivered = async (req, res) => {
    try {
        const result = await pantryService.bulkMarkDelivered(req.body.ids, req.user.id);
        res.json({ message: 'Meals marked delivered', ...result });
    } catch (err) {
        console.error('BulkMarkDelivered Error:', err);
        res.status(500).json({ message: err.message });
    }
};

exports.getByWard = async (req, res) => {
    try {
        const rows = await pantryService.getByWard(req.params.ward, req.query.date);
        res.json(rows);
    } catch (err) {
        console.error('GetByWard Error:', err);
        res.status(500).json({ message: err.message });
    }
};

exports.getPatientDietHistory = async (req, res) => {
    try {
        const rows = await pantryService.getPatientDietHistory(req.params.admissionId);
        res.json(rows);
    } catch (err) {
        console.error('GetPatientDietHistory Error:', err);
        res.status(500).json({ message: err.message });
    }
};

exports.clearDepartment = async (req, res) => {
    try {
        const result = await pantryService.clearDepartment(req.params.admissionId, req.user.id);
        res.json(result);
    } catch (err) {
        console.error('ClearDepartment Error:', err);
        res.status(500).json({ message: err.message });
    }
};

// ─── FOOD MENU ──────────────────────────────────────────
exports.getFoodMenu = async (req, res) => {
    try {
        const rows = await pantryService.getFoodMenu();
        res.json(rows);
    } catch (err) {
        console.error('GetFoodMenu Error:', err);
        res.status(500).json({ message: err.message });
    }
};

exports.addFoodMenu = async (req, res) => {
    try {
        const data = await pantryService.addFoodMenu(req.body);
        res.status(201).json({ message: 'Menu item created successfully', ...data });
    } catch (err) {
        console.error('AddFoodMenu Error:', err);
        res.status(500).json({ message: err.message });
    }
};

exports.updateFoodMenu = async (req, res) => {
    try {
        const data = await pantryService.updateFoodMenu(req.params.id, req.body);
        res.json({ message: 'Menu item updated successfully', ...data });
    } catch (err) {
        console.error('UpdateFoodMenu Error:', err);
        res.status(500).json({ message: err.message });
    }
};

exports.deleteFoodMenu = async (req, res) => {
    try {
        await pantryService.deleteFoodMenu(req.params.id);
        res.json({ message: 'Menu item deleted successfully' });
    } catch (err) {
        console.error('DeleteFoodMenu Error:', err);
        res.status(500).json({ message: err.message });
    }
};

// ─── SERVING HISTORY ────────────────────────────────────
exports.getServingHistory = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        const rows = await pantryService.getServingHistory(startDate, endDate);
        res.json(rows);
    } catch (err) {
        console.error('GetServingHistory Error:', err);
        res.status(500).json({ message: err.message });
    }
};

