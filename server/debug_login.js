const authController = require('./src/modules/auth/auth.controller');
const httpMocks = require('node-mocks-http');
const dotenv = require('dotenv');
const path = require('path');

// Load env
dotenv.config({ path: path.join(__dirname, '.env') });

async function testLogin() {
    console.log('Testing Login...');

    const req = httpMocks.createRequest({
        method: 'POST',
        url: '/api/auth/login',
        body: {
            username: 'admin',
            password: 'admin123'
        }
    });

    const res = httpMocks.createResponse();

    try {
        await authController.login(req, res);
        console.log('Status Code:', res.statusCode);
        console.log('Response Data:', res._getData());
    } catch (e) {
        console.error('CRASH in Login Controller:', e);
    }
}

testLogin();
