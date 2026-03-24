const request = require('supertest');
const app = require('../src/app');
const db = require('../src/config/db');

// Mock any DB response if needed specifically for this file
// Mocking is actually handled in setup.js for the entire suite.

describe('Auth API', () => {
    it('GET /api/auth/roles should return available roles', async () => {
        const res = await request(app).get('/api/auth/roles');
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBeTruthy();
    });

    it('POST /api/auth/login with missing data should return 400', async () => {
        const res = await request(app).post('/api/auth/login').send({});
        expect(res.statusCode).toBe(400);
    });

    it('POST /api/auth/login with valid credentials should succeed', async () => {
        const res = await request(app).post('/api/auth/login').send({
            username: 'admin',
            password: 'password123'
        });
        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.token).toBeDefined();
    });
});
