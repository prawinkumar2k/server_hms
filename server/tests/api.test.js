const request = require('supertest');
const app = require('../src/app');
const db = require('../src/config/db');

describe('API Endpoints', () => {
  it('should return UP for health check', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('UP');
  });

  it('should return 200 for root endpoint', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toContain('HMS Server is operational');
  });

  it('should return 404 for unknown routes', async () => {
    const res = await request(app).get('/api/unknown-route-123');
    expect(res.statusCode).toBe(404);
  });
});
