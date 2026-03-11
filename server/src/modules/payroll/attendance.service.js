const db = require('../../config/db');

// SHIFTS
exports.getAllShifts = async () => {
    const [rows] = await db.execute('SELECT * FROM shifts');
    return rows;
};

// ATTENDANCE
exports.markAttendance = async (data) => {
    const { employeeId, date, shiftId, inTime, outTime, status, remarks } = data;

    // TODO: Calculate late/OT logic here based on Shift

    // Upsert logic (Insert or Update if exists for that date)
    const query = `
        INSERT INTO attendance_logs (employee_id, date, shift_id, in_time, out_time, status, remarks, is_manual_entry)
        VALUES (?, ?, ?, ?, ?, ?, ?, TRUE)
        ON DUPLICATE KEY UPDATE
        shift_id=?, in_time=?, out_time=?, status=?, remarks=?, is_manual_entry=TRUE
    `;

    const values = [
        employeeId, date, shiftId, inTime, outTime, status, remarks,
        shiftId, inTime, outTime, status, remarks
    ];

    await db.execute(query, values);
    return { employeeId, date, status };
};

exports.getAttendanceByDate = async (date) => {
    // Join with employees to get names
    const query = `
        SELECT 
            e.id as employee_id, e.first_name, e.last_name, e.employee_code, e.department,
            a.id as attendance_id, a.status, a.in_time, a.out_time, a.shift_id, s.name as shift_name
        FROM employees e
        LEFT JOIN attendance_logs a ON e.id = a.employee_id AND a.date = ?
        LEFT JOIN shifts s ON a.shift_id = s.id
        WHERE e.status = 'Active'
        ORDER BY e.first_name
    `;
    const [rows] = await db.execute(query, [date]);
    return rows;
};
