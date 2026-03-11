const db = require('../../config/db');

// Get all employees
exports.getAllEmployees = async () => {
    const [rows] = await db.execute('SELECT * FROM employees ORDER BY created_at DESC');
    return rows;
};

// Get single employee
exports.getEmployeeById = async (id) => {
    const [rows] = await db.execute('SELECT * FROM employees WHERE id = ?', [id]);
    return rows[0];
};

// Create employee
exports.createEmployee = async (data) => {
    const {
        firstName, lastName, email, phone, dob, gender, bloodGroup, address,
        department, designation, dateOfJoining, employmentType,
        bankName, accountNumber, ifscCode, panNumber, aadhaarNumber, uanNumber, esicNumber
    } = data;

    // Generate Employee Code (e.g., EMP + Timestamp for uniqueness for now)
    // Real world logic might be sequential EMP001, EMP002. Using timestamp for simplicity & uniqueness.
    const employeeCode = `EMP${Date.now().toString().slice(-6)}`;

    const query = `
        INSERT INTO employees 
        (employee_code, first_name, last_name, email, phone, dob, gender, blood_group, address,
        department, designation, date_of_joining, employment_type,
        bank_name, account_number, ifsc_code, pan_number, aadhaar_number, uan_number, esic_number)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
        employeeCode, firstName, lastName, email, phone, dob, gender, bloodGroup, address,
        department, designation, dateOfJoining, employmentType,
        bankName, accountNumber, ifscCode, panNumber, aadhaarNumber, uanNumber, esicNumber
    ];

    const [result] = await db.execute(query, values);
    return { id: result.insertId, ...data, employeeCode };
};

// Update employee
exports.updateEmployee = async (id, data) => {
    const {
        firstName, lastName, email, phone, dob, gender, bloodGroup, address,
        department, designation, dateOfJoining, employmentType, status,
        bankName, accountNumber, ifscCode, panNumber, aadhaarNumber, uanNumber, esicNumber
    } = data;

    const query = `
        UPDATE employees SET
        first_name=?, last_name=?, email=?, phone=?, dob=?, gender=?, blood_group=?, address=?,
        department=?, designation=?, date_of_joining=?, employment_type=?, status=?,
        bank_name=?, account_number=?, ifsc_code=?, pan_number=?, aadhaar_number=?, uan_number=?, esic_number=?
        WHERE id=?
    `;

    const values = [
        firstName, lastName, email, phone, dob, gender, bloodGroup, address,
        department, designation, dateOfJoining, employmentType, status,
        bankName, accountNumber, ifscCode, panNumber, aadhaarNumber, uanNumber, esicNumber,
        id
    ];

    await db.execute(query, values);
    return { id, ...data };
};
