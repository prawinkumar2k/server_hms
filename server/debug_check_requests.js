const db = require('./src/config/db');

async function checkRequests() {
    try {
        const [rows] = await db.execute('SELECT * FROM lab_requests');
        console.log('Lab Requests:', rows);

        const [items] = await db.execute('SELECT * FROM lab_request_items');
        console.log('Request Items:', items);
    } catch (e) {
        console.error(e);
    }
    process.exit();
}

checkRequests();
