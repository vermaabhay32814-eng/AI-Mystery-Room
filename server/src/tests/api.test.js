// server/src/tests/api.test.js
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import app from '../app.js';
import { User } from '../models/User.js';
import { connectDB, disconnectDB } from '../config/db.js';

describe('AI Mystery Room API Unit & Integration Tests', () => {
  beforeAll(async () => {
    await connectDB();
  });

  afterAll(async () => {
    await disconnectDB();
  });

  describe('GET /api/v1/health (SPEC.md Section 17)', () => {
    it('reports health status and service connectivity', async () => {
      const res = await request(app).get('/api/v1/health');
      expect([200, 503]).toContain(res.status);
      expect(res.body.services).toBeDefined();
      expect(res.body.services.server).toBe('running');
    });
  });

  describe('404 Route Handling', () => {
    it('returns standardized JSON error for non-existent endpoints', async () => {
      const res = await request(app).get('/api/v1/non-existent-room');
      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('ROUTE_NOT_FOUND');
    });
  });

  describe('Request Body Validation (SPEC.md Section 10)', () => {
    it('rejects case generation when scenario is too short (< 50 characters)', async () => {
      const res = await request(app)
        .post('/api/v1/cases')
        .send({
          scenario: 'Too short',
          genre: 'theft'
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('VALIDATION_ERROR');
    });

    it('rejects user registration with invalid email or short password', async () => {
      const res = await request(app)
        .post('/api/v1/auth/register')
        .send({
          name: 'Holmes',
          email: 'not-an-email',
          password: '123'
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('VALIDATION_ERROR');
    });
  });

  describe('User Model Password Hashing & Security (SPEC.md Section 3.3)', () => {
    it('hashes passwords using bcrypt and verifies matches correctly', async () => {
      const rawPassword = 'SecretDetectivePassword123!';
      const user = new User({
        name: 'Inspector Lestrade',
        email: 'lestrade@scotlandyard.gov',
        password: rawPassword
      });

      await user.save();
      expect(user.password).not.toBe(rawPassword);
      const isMatch = await user.comparePassword(rawPassword);
      expect(isMatch).toBe(true);
    });

    it('never includes password in JSON serialization', () => {
      const user = new User({
        name: 'Inspector Lestrade',
        email: 'lestrade@scotlandyard.gov',
        password: 'hashed_password_sample'
      });

      const json = user.toJSON();
      expect(json.password).toBeUndefined();
    });
  });
});
