const db = require('../../config/db');

// Upsert Salary Structure
exports.updateSalaryStructure = async (employeeId, data) => {
    const {
        basic, hra, da, travel, medical, special,
        pf, esi, pt, tds
    } = data;

    // Auto-calculate totals
    const gross = (parseFloat(basic) || 0) + (parseFloat(hra) || 0) + (parseFloat(da) || 0) + (parseFloat(travel) || 0) + (parseFloat(medical) || 0) + (parseFloat(special) || 0);
    const deductions = (parseFloat(pf) || 0) + (parseFloat(esi) || 0) + (parseFloat(pt) || 0) + (parseFloat(tds) || 0);
    const net = gross - deductions;

    const query = `
        INSERT INTO salary_structures 
        (employee_id, basic_salary, hra, da, travel_allowance, medical_allowance, special_allowance, pf_employee, esi_employee, pt, tds, gross_salary, total_deductions, net_salary)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
        basic_salary=?, hra=?, da=?, travel_allowance=?, medical_allowance=?, special_allowance=?,
        pf_employee=?, esi_employee=?, pt=?, tds=?,
        gross_salary=?, total_deductions=?, net_salary=?
    `;

    const values = [
        employeeId, basic, hra, da, travel, medical, special, pf, esi, pt, tds, gross, deductions, net,
        basic, hra, da, travel, medical, special, pf, esi, pt, tds, gross, deductions, net
    ];

    await db.execute(query, values);
    return { ...data, gross, deductions, net };
};

// Get All Salaries (Joined with Employee info)
exports.getAllSalaries = async () => {
    const query = `
        SELECT 
            e.id as employee_id, e.first_name, e.last_name, e.employee_code, e.department, e.designation, e.date_of_joining as doj,
            s.basic_salary, s.hra, s.da, s.gross_salary, s.total_deductions, s.net_salary, s.updated_at
        FROM employees e
        LEFT JOIN salary_structures s ON e.id = s.employee_id
        WHERE e.status != 'Terminated'
        ORDER BY e.first_name
    `;
    const [rows] = await db.execute(query);
    return rows;
};

// Get single employee salary
exports.getSalaryByEmployee = async (employeeId) => {
    const [rows] = await db.execute('SELECT * FROM salary_structures WHERE employee_id = ?', [employeeId]);
    return rows[0] || {};
};
