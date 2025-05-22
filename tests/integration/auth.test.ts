import request from 'supertest';
import app from '../../src/app';
import { User } from '../../src/models/core/User.model';

describe('Auth Integration Tests', () => {
  beforeAll(async () => {
    await User.sync({ force: true });
  });

  it('should login successfully', async () => {
    await User.create({
      email: 'test@lms.com',
      password: 'password123',
      role: 'APPRENANT'
    });

    const response = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@lms.com', password: 'password123' });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
  });
});
