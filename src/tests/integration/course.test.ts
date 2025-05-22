import request from 'supertest';
import app from '../../app';
import { setupTestEnvironment, teardownTestEnvironment } from './testUtils';

describe('Course API Integration Tests', () => {
  let authToken: string;

  beforeAll(async () => {
    await setupTestEnvironment();
    
    // Register and login a test user
    await request(app)
      .post('/api/auth/register')
      .send({
        email: 'instructor@example.com',
        password: 'Password123!',
        firstName: 'Instructor',
        lastName: 'User',
        role: 'INSTRUCTOR'
      });

    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'instructor@example.com',
        password: 'Password123!'
      });

    authToken = loginRes.body.token;
  });

  afterAll(async () => {
    await teardownTestEnvironment();
  });

  describe('POST /api/courses', () => {
    it('should create a new course', async () => {
      const response = await request(app)
        .post('/api/courses')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Test Course',
          description: 'Test Description',
          category: 'DEVELOPMENT'
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
    });
  });

  // More course tests...
});
