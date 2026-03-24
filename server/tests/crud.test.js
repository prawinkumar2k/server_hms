const request = require('supertest');
const app = require('../src/app');
const db = require('../src/config/db');

describe('Full Hospital Workflow Integration', () => {
    let token;
    let testPatientId = "1";

    beforeAll(async () => {
        // 1. LOGIN to get token — we mock this in setup.js, so 'admin' works
        const res = await request(app).post('/api/auth/login').send({
            username: 'admin',
            password: 'password123'
        });
        token = res.body.token;
    });

    describe('Patients Module (CRUD)', () => {
        it('POST /api/patients should register a patient', async () => {
            const res = await request(app)
                .post('/api/patients')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    name: 'Integration Test Patient',
                    phone: '9998887776',
                    gender: 'Female',
                    age: 30
                });
            expect(res.statusCode === 201 || res.statusCode === 200).toBeTruthy();
            if (res.body.id) testPatientId = res.body.id;
        });

        it('GET /api/patients should list all patients', async () => {
            const res = await request(app)
                .get('/api/patients')
                .set('Authorization', `Bearer ${token}`);
            expect(res.statusCode).toBe(200);
            expect(Array.isArray(res.body)).toBeTruthy();
        });
    });

    describe('Appointments Module (CRUD)', () => {
        it('POST /api/appointments should schedule an appointment', async () => {
            const res = await request(app)
                .post('/api/appointments')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    patient_id: testPatientId,
                    doctor_id: "1",
                    date: '2026-03-25',
                    time: '02:00 PM',
                    department: 'Cardiology'
                });
            expect(res.statusCode === 201 || res.statusCode === 200).toBeTruthy();
        });

        it('GET /api/appointments should return list', async () => {
            const res = await request(app)
                .get('/api/appointments')
                .set('Authorization', `Bearer ${token}`);
            expect(res.statusCode).toBe(200);
        });
    });
});
