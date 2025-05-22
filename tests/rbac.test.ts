import request from 'supertest';
import app from '../src/app';
import { User, Role, Permission, Notification } from '../src/models';
import { redisClient } from '../src/config/redis';
import { NotificationService } from '../src/services/Notification.service';

describe('RBAC Extended Tests with Notifications', () => {
  let adminToken: string;
  let instructorToken: string;
  let studentToken: string;

  beforeAll(async () => {
    // Setup test data
    await User.sync({ force: true });
    await Role.sync({ force: true });
    await Permission.sync({ force: true });
    await Notification.sync({ force: true });

    // Create test users
    const [admin, instructor, student] = await User.bulkCreate([
      { email: 'admin@test.com', password: 'pass123' },
      { email: 'instructor@test.com', password: 'pass123' },
      { email: 'student@test.com', password: 'pass123' }
    ]);

    // Assign roles
    await Role.bulkCreate([
      { type: 'ADMIN', userId: admin.id },
      { type: 'INSTRUCTOR', userId: instructor.id },
      { type: 'STUDENT', userId: student.id }
    ]);

    // Set permissions
    await Permission.bulkCreate([
      { resource: 'course', create: true, read: true, update: true, delete: true, roleId: 1 },
      { resource: 'course', create: true, read: true, update: true, delete: false, roleId: 2 },
      { resource: 'course', create: false, read: true, update: false, delete: false, roleId: 3 }
    ]);

    // Login and get tokens
    const tokens = await Promise.all([
      request(app).post('/api/auth/login').send({ email: 'admin@test.com', password: 'pass123' }),
      request(app).post('/api/auth/login').send({ email: 'instructor@test.com', password: 'pass123' }),
      request(app).post('/api/auth/login').send({ email: 'student@test.com', password: 'pass123' })
    ]);

    adminToken = tokens[0].body.token;
    instructorToken = tokens[1].body.token;
    studentToken = tokens[2].body.token;
  });

  describe('Notification Integration', () => {
    test('Admin actions should trigger notifications', async () => {
      const res = await request(app)
        .post('/api/courses')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ title: 'New Course' });

      expect(res.status).toBe(201);

      // Verify notification was created
      const notifications = await Notification.findAll({
        where: { type: 'SYSTEM' }
      });
      expect(notifications.length).toBeGreaterThan(0);
      expect(notifications[0].message).toContain('New Course');
    });

    test('Permission changes should notify affected users', async () => {
      await request(app)
        .patch('/api/permissions/2')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ create: false });

      const notifications = await NotificationService.getUserNotifications('instructor@test.com');
      expect(notifications.some(n => n.type === 'SECURITY')).toBeTruthy();
    });
  });

  describe('Analytics Reports', () => {
    test('Should generate access report', async () => {
      // Generate test data
      await Notification.bulkCreate([
        { userId: 1, type: 'SYSTEM', message: 'Test 1', isRead: false },
        { userId: 2, type: 'COURSE', message: 'Test 2', isRead: true },
        { userId: 1, type: 'SECURITY', message: 'Test 3', isRead: false }
      ]);

      const res = await request(app)
        .get('/api/analytics/notifications')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('unreadCount');
      expect(res.body).toHaveProperty('byType');
      expect(res.body.byType.SYSTEM).toBe(1);
    });
  });

  describe('Performance Improvements', () => {
    test('Notification delivery should be fast (<100ms)', async () => {
      const start = Date.now();
      await NotificationService.createNotification(
        'student@test.com',
        'COURSE',
        'Performance test'
      );
      const duration = Date.now() - start;
      expect(duration).toBeLessThan(100);
    });

    test('Bulk operations should use Redis pipeline', async () => {
      const mockPipeline = jest.spyOn(redisClient, 'pipeline');
      
      await NotificationService.createNotification(
        'instructor@test.com',
        'SYSTEM',
        'Bulk test'
      );
      
      expect(mockPipeline).toHaveBeenCalled();
    });
  });
});
