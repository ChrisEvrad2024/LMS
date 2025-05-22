import { Notification } from '../models';
import { redisClient } from '../config/redis';
import { logger } from '../utils/logger';

export class NotificationService {
  static async createNotification(userId: string, type: string, message: string) {
    // Validate type
    const validTypes = ['SYSTEM', 'COURSE', 'SECURITY'];
    if (!validTypes.includes(type)) {
      throw new Error('Invalid notification type');
    }

    const startTime = Date.now();
    
    const notification = await Notification.create({
      userId,
      type,
      message,
      isRead: false
    });

    // Publish to Redis
    await redisClient.publish(
      `user:${userId}:notifications`,
      JSON.stringify(notification)
    );

    const duration = Date.now() - startTime;
    logger.info(`Notification delivered in ${duration}ms`);

    return notification;
  }

  static async bulkCreate(notifications: Array<{
    userId: string;
    type: string;
    message: string;
  }>) {
    const pipeline = redisClient.pipeline();
    const created = [];

    for (const notif of notifications) {
      const n = await Notification.create({
        ...notif,
        isRead: false
      });
      created.push(n);
      pipeline.publish(
        `user:${notif.userId}:notifications`,
        JSON.stringify(n)
      );
    }

    await pipeline.exec();
    return created;
  }

  static async getUserNotifications(userId: string) {
    return Notification.findAll({
      where: { userId },
      order: [['createdAt', 'DESC']]
    });
  }
}
