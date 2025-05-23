import request from 'supertest';
import app from '../src/app';
import { User } from '../src/models';
import { redisClient } from '../src/config/redis';

describe('Authentication Package (US019-US021)', () => {
  beforeAll(async () => {
    await User.sync({ force: true });
  });

  // US019: Login
  test('should authenticate user with valid credentials', async () => {
    await User.create({
      email: 'test@lms.com',
      password: 'password123',
      role: 'STUDENT'
    });

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@lms.com', password: 'password123' });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
  });

  // US020: Profile Management
  test('should update user profile', async () => {
    const user = await User.create({ /* test user */ });
    const token = generateTestToken(user.id);

    const res = await request(app)
      .put('/api/users/profile')
      .set('Authorization', `Bearer ${token}`)
      .send({ firstName: 'Updated' });

    expect(res.status).toBe(200);
    expect(res.body.firstName).toBe('Updated');
  });

  // US021: Password Reset
  test('should initiate password reset', async () => {
    const spy = jest.spyOn(redisClient, 'setEx');
    await request(app)
      .post('/api/auth/reset-password')
      .send({ email: 'test@lms.com' });

    expect(spy).toHaveBeenCalled();
  });
});
