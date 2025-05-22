import request from 'supertest';
import app from '../src/app';
import { Notification, User } from '../src/models';
import { redisClient } from '../src/config/redis';
import { NotificationService } from '../src/services/Notification.service';

describe('Notification System Tests', () => {
  let adminToken: string;
  let testUserId: string;

  beforeAll(async () => {
    await Notification.sync({ force: true });
    const user = await User.create({ email: 'test@notif.com', password: 'pass123' });
    testUserId = user.id;

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@test.com', password: 'pass123' });
    adminToken = res.body.token;
  });

  describe('Notification Creation', () => {
    test('Should create system notification', async () => {
      const res = await request(app)
        .post('/api/notifications')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          userId: testUserId,
          type: 'SYSTEM',
          message: 'Test notification'
        });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('id');

      const notification = await Notification.findByPk(res.body.id);
      expect(notification?.isRead).toBe(false);
    });

    test('Should validate notification types', async () => {
      const res = await request(app)
        .post('/api/notifications')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          userId: testUserId,
          type: 'INVALID_TYPE',
          message: 'Test'
        });

      expect(res.status).toBe(400);
    });
  });

  describe('Notification Delivery', () => {
    test('Should deliver via Redis pub/sub', async () => {
      const mockPublish = jest.spyOn(redisClient, 'publish');
      
      await NotificationService.createNotification(
        testUserId,
        'COURSE',
        'Redis test'
      );

      expect(mockPublish).toHaveBeenCalled();
      expect(mockPublish.mock.calls[0][0]).toContain(testUserId);
    });

    test('Bulk delivery should use pipeline', async () => {
      const mockPipeline = jest.spyOn(redisClient, 'pipeline');
      
      await NotificationService.bulkCreate([
        { userId: testUserId, type: 'SYSTEM', message: 'Bulk 1' },
        { userId: testUserId, type: 'SYSTEM', message: 'Bulk 2' }
      ]);

      expect(mockPipeline).toHaveBeenCalled();
      expect(mockPipeline.mock.calls[0][0].length).toBe(2);
    });
  });

  describe('Notification Analytics', () => {
    beforeAll(async () => {
      await Notification.bulkCreate([
        { userId: testUserId, type: 'SYSTEM', message: 'Test 1', isRead: false },
        { userId: testUserId, type: 'COURSE', message: 'Test 2', isRead: true },
        { userId: testUserId, type: 'SECURITY', message: 'Test 3', isRead: false }
      ]);
    });

    test('Should generate accurate reports', async () => {
      const res = await request(app)
        .get('/api/analytics/notifications')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.unreadCount).toBe(2);
      expect(res.body.byType.SYSTEM).toBe(1);
    });

    test('Should track delivery performance', async () => {
      const start = Date.now();
      await NotificationService.createNotification(
        testUserId,
        'PERFORMANCE',
        'Test'
      );
      const duration = Date.now() - start;

      const res = await request(app)
        .get('/api/analytics/performance')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.body.avgDeliveryTime).toBeLessThan(100);
    });
  });
});
