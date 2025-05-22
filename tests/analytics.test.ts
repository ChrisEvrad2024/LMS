import request from 'supertest';
import app from '../src/app';
import { Notification, User, Role } from '../src/models';
import { AnalyticsService } from '../src/services/Analytics.service';

describe('Analytics System Tests', () => {
  let adminToken: string;

  beforeAll(async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@test.com', password: 'pass123' });
    adminToken = res.body.token;

    // Setup test data
    await Notification.sync({ force: true });
    await Role.sync({ force: true });

    await Notification.bulkCreate([
      { userId: 1, type: 'SYSTEM', message: 'Test 1', isRead: false },
      { userId: 1, type: 'COURSE', message: 'Test 2', isRead: true },
      { userId: 2, type: 'SECURITY', message: 'Test 3', isRead: false }
    ]);

    await Role.bulkCreate([
      { type: 'ADMIN', userId: 1 },
      { type: 'INSTRUCTOR', userId: 2 },
      { type: 'STUDENT', userId: 3 }
    ]);
  });

  describe('Report Generation', () => {
    test('Should generate notification report', async () => {
      const report = await AnalyticsService.getNotificationReport();
      
      expect(report).toHaveProperty('total', 3);
      expect(report).toHaveProperty('unread', 2);
      expect(report.byType.SYSTEM).toBe(1);
    });

    test('Should generate security report', async () => {
      const report = await AnalyticsService.getSecurityReport();
      
      expect(report.permissionChanges.length).toBe(1);
      expect(report.roleDistribution.length).toBe(3);
    });
  });

  describe('Access Control', () => {
    test('Should restrict analytics to admins', async () => {
      const userRes = await request(app)
        .post('/api/auth/login')
        .send({ email: 'student@test.com', password: 'pass123' });
      
      const res = await request(app)
        .get('/api/analytics/notifications')
        .set('Authorization', `Bearer ${userRes.body.token}`);

      expect(res.status).toBe(403);
    });

    test('Should log unauthorized access attempts', async () => {
      const mockLog = jest.spyOn(console, 'log');
      
      await request(app)
        .get('/api/analytics/security')
        .set('Authorization', 'Bearer invalid_token');

      expect(mockLog).toHaveBeenCalledWith(
        expect.stringContaining('SECURITY')
      );
    });
  });

  describe('Performance Metrics', () => {
    test('Should track report generation time', async () => {
      const start = Date.now();
      await AnalyticsService.getNotificationReport();
      const duration = Date.now() - start;

      expect(duration).toBeLessThan(200);
    });

    test('Should cache frequent reports', async () => {
      const mockGet = jest.spyOn(redisClient, 'get');
      
      await AnalyticsService.getNotificationReport();
      await AnalyticsService.getNotificationReport();

      expect(mockGet).toHaveBeenCalledTimes(2);
    });
  });
});
