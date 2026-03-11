const db = require('../config/db');

async function seedEmployees() {
    try {
        console.log('Seeding employees...');

        // 1. Check if employees exist
        const [rows] = await db.execute('SELECT COUNT(*) as count FROM employees');
        if (rows[0].count > 0) {
            console.log('Employees already exist. Skipping seed.');
            process.exit(0);
        }

        // 2. Insert Dummy Employees
        const employees = [
            {
                code: 'EMP001', fname: 'Sarah', lname: 'Connor', dept: 'Nursing', desig: 'Head Nurse',
                email: 'sarah.c@hospital.com', type: 'Permanent', status: 'Active'
            },
            {
                code: 'EMP002', fname: 'John', lname: 'Doe', dept: 'Administration', desig: 'Receptionist',
                email: 'john.d@hospital.com', type: 'Permanent', status: 'Active'
            },
            {
                code: 'EMP003', fname: 'Emily', lname: 'Blunt', dept: 'Laboratory', desig: 'Lab Technician',
                email: 'emily.b@hospital.com', type: 'Contract', status: 'Active'
            },
            {
                code: 'EMP004', fname: 'Michael', lname: 'Scott', dept: 'Administration', desig: 'Manager',
                email: 'michael.s@hospital.com', type: 'Permanent', status: 'Active'
            },
            {
                code: 'EMP005', fname: 'Gregory', lname: 'House', dept: 'Medical', desig: 'Senior Doctor',
                email: 'greg.h@hospital.com', type: 'Permanent', status: 'Active'
            }
        ];

        for (const emp of employees) {
            await db.execute(`
                INSERT INTO employees 
                (employee_code, first_name, last_name, email, department, designation, employment_type, status, date_of_joining)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())
            `, [emp.code, emp.fname, emp.lname, emp.email, emp.dept, emp.desig, emp.type, emp.status]);
        }

        console.log(`Seeded ${employees.length} employees successfully.`);
        process.exit(0);

    } catch (err) {
        console.error('Seeding failed:', err);
        process.exit(1);
    }
}

seedEmployees();
