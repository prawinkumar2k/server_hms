const attendanceService = require('./attendance.service');

exports.getShifts = async (req, res) => {
    try {
        const shifts = await attendanceService.getAllShifts();
        res.json(shifts);
    } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.getDailyAttendance = async (req, res) => {
    try {
        const { date } = req.query; // YYYY-MM-DD
        if (!date) return res.status(400).json({ error: 'Date is required' });

        const data = await attendanceService.getAttendanceByDate(date);
        res.json(data);
    } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.markAttendance = async (req, res) => {
    try {
        /* Body expected: { 
            employeeId, date, shiftId, inTime, outTime, status 
           } 
        */
        const { employeeId, date, shiftId, status } = req.body;

        if (!employeeId || !date || !status) {
            return res.status(400).json({ error: 'employeeId, date, and status are required' });
        }

        // If shiftId is not provided, try to assign null (will skip FK check if nullable)
        const finalShiftId = shiftId || null;

        await attendanceService.markAttendance({
            ...req.body,
            shiftId: finalShiftId,
            inTime: req.body.inTime || null,
            outTime: req.body.outTime || null
        });
        res.json({ message: 'Attendance updated' });
    } catch (err) {
        console.error('markAttendance error:', err);
        res.status(500).json({ error: err.message });
    }
};
