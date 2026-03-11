const UserService = require('./src/modules/user-management/user-management.service');
const LogService = require('./src/modules/logs/logs.service');
const db = require('./src/config/db');

async function testUserManagement() {
    try {
        console.log('--- Testing User Management ---');

        // 1. Get Roles
        console.log('Fetching roles...');
        const roles = await UserService.getAllRoles();
        console.log('Roles:', roles.map(r => r.role));

        // 2. Get Modules
        console.log('Fetching modules...');
        const modules = await UserService.getModules();
        console.log('Modules Categories:', Object.keys(modules));

        // 3. Create User
        const testUser = {
            username: 'test_admin_' + Date.now(),
            password: 'password123',
            full_name: 'Test Admin User',
            role: 'Admin',
            module_access: ['dashboard', 'users', 'logs'],
            staff_id: null, // Optional
            staff_name: null
        };

        console.log('Creating user:', testUser.username);
        const userId = await UserService.createUser(testUser);
        console.log('User created with ID:', userId);

        // 4. Get User
        console.log('Fetching all users...');
        const users = await UserService.getAllUsers();
        // Check if our user is there
        const found = users.find(u => u.username === testUser.username);
        if (found) {
            console.log('User found in list:', found.username);
        } else {
            console.error('User NOT found in list!');
        }

        // 5. Update User
        console.log('Updating user...');
        await UserService.updateUser(userId, {
            role: 'Doctor',
            module_access: ['patients'],
            status: 'Inactive'
        });
        console.log('User updated.');

        // 6. Verify Update
        const usersAfter = await UserService.getAllUsers();
        const updated = usersAfter.find(u => u.id === userId);
        console.log('Updated User Role:', updated.role); // Should be Doctor
        console.log('Updated User Status:', updated.status); // Should be Inactive

        // 7. Cleanup (Delete User)
        console.log('Deleting user...');
        await UserService.deleteUser(userId);
        console.log('User deleted.');

        // 8. Test Logs Service
        console.log('--- Testing Logs ---');
        // We need to manually insert a log first as the controller handles logging usually
        await db.execute(
            'INSERT INTO log_details (username, role, action, details) VALUES (?, ?, ?, ?)',
            ['system', 'System', 'Test Log', 'This is a test log']
        );

        const logs = await LogService.getLogs({ limit: 5 });
        console.log('Recent Logs Count:', logs.logs.length);
        if (logs.logs.length > 0) {
            const firstLog = logs.logs[0];
            console.log('First Log Action:', firstLog.action, 'User:', firstLog.username);
        }

        console.log('--- TEST COMPLETE ---');

    } catch (error) {
        console.error('TEST FAILED MESSAGE:', error.message);
        console.error('TEST FAILED FULL:', error);
    } finally {
        process.exit();
    }
}

testUserManagement();
