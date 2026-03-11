const db = require('../../config/db');

// Get payslips for a specific month
exports.getPayslipsByMonth = async (month, year) => {
    const [rows] = await db.execute(`
        SELECT p.*, e.first_name, e.last_name, e.employee_code, e.department, e.designation
        FROM payslips p
        JOIN employees e ON p.employee_id = e.id
        WHERE p.month = ? AND p.year = ?
        ORDER BY e.first_name
    `, [month, year]);
    return rows;
};

// Generate Payslips for all active employees for a month
exports.generatePayslips = async (month, year) => {
    // 1. Get all active employees with their salary structure
    const [employees] = await db.execute(`
        SELECT e.id, e.first_name, e.last_name, s.* 
        FROM employees e
        LEFT JOIN salary_structures s ON e.id = s.employee_id
        WHERE e.status = 'Active'
    `);

    const payslips = [];

    for (const emp of employees) {
        if (!emp.gross_salary) continue; // Skip if no salary structure defined

        // 2. Get attendance summary for the month
        // Count 'Present', 'Leave' (paid), 'Holiday' (paid) as present days.
        // Count 'Absent' as LOP.
        // For simplicity, let's assume standard 30 day month for calculation, but check actual absent days.

        const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
        const endDate = new Date(year, month, 0).toISOString().split('T')[0]; // Last day of month

        const [attendance] = await db.execute(`
            SELECT status, COUNT(*) as count 
            FROM attendance_logs 
            WHERE employee_id = ? AND date BETWEEN ? AND ?
            GROUP BY status
        `, [emp.id, startDate, endDate]);

        const stats = { Present: 0, Absent: 0, Leave: 0, Holiday: 0 };
        attendance.forEach(row => {
            if (stats[row.status] !== undefined) stats[row.status] = row.count;
        });

        // 3. Calculate Days
        const totalDays = 30; // Standardize for payroll
        // If absent days are recorded, deduct them. If no records, assume full presence? 
        // Or assume absent if not marked?
        // Let's assume: Payable Days = Total Days - Absent Days.

        const daysPresent = stats.Present + stats.Leave + stats.Holiday;
        // Note: This logic depends on whether weekends are auto-marked or ignored. 
        // For now, let's just use: Payable = 30 - Absent.

        const daysAbsent = stats.Absent;
        const payableDays = Math.max(0, totalDays - daysAbsent);

        // 4. Calculate Salary Prorated
        const perDaySalary = emp.gross_salary / totalDays;
        const lossOfPay = (daysAbsent * perDaySalary).toFixed(2);

        const grossEarnings = (emp.gross_salary - lossOfPay).toFixed(2);

        // Prorate distinct components (simplified)
        // basic = (basic / 30) * payableDays
        const basic = ((emp.basic_salary / totalDays) * payableDays).toFixed(2);
        const hra = ((emp.hra / totalDays) * payableDays).toFixed(2);
        const allowances = (grossEarnings - basic - hra).toFixed(2);

        // Deductions (PF/ESI usually fixed or percentage, keeping fixed for now unless LOP is huge)
        // Let's keep deductions fixed for simplicity unless user asks for complex rules
        const totalDeductions = emp.total_deductions;

        const netSalary = (grossEarnings - totalDeductions).toFixed(2);

        // 5. Upsert Payslip
        try {
            await db.execute(`
                INSERT INTO payslips (
                    employee_id, month, year, 
                    total_days, days_present, days_absent, days_leave,
                    basic_salary, hra, allowances, 
                    gross_earnings, total_deductions, net_salary, loss_of_pay,
                    status
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Generated')
                ON DUPLICATE KEY UPDATE
                    total_days=VALUES(total_days),
                    days_present=VALUES(days_present), 
                    days_absent=VALUES(days_absent), 
                    days_leave=VALUES(days_leave),
                    basic_salary=VALUES(basic_salary), 
                    hra=VALUES(hra), 
                    allowances=VALUES(allowances), 
                    gross_earnings=VALUES(gross_earnings), 
                    total_deductions=VALUES(total_deductions), 
                    net_salary=VALUES(net_salary), 
                    loss_of_pay=VALUES(loss_of_pay),
                    status='Generated', 
                    generated_at=NOW()
            `, [
                emp.id, month, year,
                totalDays, daysPresent, daysAbsent, stats.Leave || 0,
                basic, hra, allowances,
                grossEarnings, totalDeductions, netSalary, lossOfPay
            ]);

            payslips.push({
                employee_id: emp.id,
                name: `${emp.first_name} ${emp.last_name}`,
                net_salary: netSalary,
                status: 'Generated'
            });
        } catch (err) {
            console.error(`Failed to generate payslip for Emp #${emp.id}:`, err);
        }
    }

    return payslips;
};
