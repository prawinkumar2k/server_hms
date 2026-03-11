const db = require('../src/config/db');

exports.getAllLogs = async (req, res) => {
    try {
        // Only Admin should access this - Middleware should handle it, but double check role if needed
        // Assuming RBAC middleware is applied on route

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const offset = (page - 1) * limit;

        const [logs] = await db.query('SELECT * FROM log_details ORDER BY login_date DESC LIMIT ? OFFSET ?', [limit, offset]);
        const [[{ count }]] = await db.query('SELECT COUNT(*) as count FROM log_details');

        res.status(200).json({
            success: true,
            data: logs,
            pagination: {
                total: count,
                page,
                limit,
                totalPages: Math.ceil(count / limit)
            }
        });
    } catch (error) {
        console.error('Error fetching logs:', error);
        res.status(500).json({ success: false, message: 'Error fetching logs' });
    }
};

exports.deleteOldLogs = async (req, res) => {
    const { days } = req.body;

    if (!days || isNaN(days)) {
        return res.status(400).json({ success: false, message: 'Valid days parameter is required' });
    }

    try {
        await db.query('DELETE FROM log_details WHERE login_date < NOW() - INTERVAL ? DAY', [days]);
        res.status(200).json({ success: true, message: `Logs older than ${days} days deleted` });
    } catch (error) {
        console.error('Error deleting logs:', error);
        res.status(500).json({ success: false, message: 'Error deleting logs' });
    }
};
