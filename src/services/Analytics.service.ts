import { Notification, User, Role } from '../models';
import { logger } from '../utils/logger';

export class AnalyticsService {
  static async getNotificationReport() {
    const [total, unread] = await Promise.all([
      Notification.count(),
      Notification.count({ where: { isRead: false } })
    ]);

    const byType = await Notification.findAll({
      attributes: ['type', [sequelize.fn('COUNT', 'id'), 'count']],
      group: ['type']
    });

    const activeUsers = await User.findAll({
      attributes: ['id', 'email'],
      include: [{
        model: Notification,
        attributes: [[sequelize.fn('COUNT', 'id'), 'notificationCount']],
        required: true
      }],
      order: [[Notification, 'createdAt', 'DESC']],
      limit: 5
    });

    return {
      total,
      unread,
      byType: byType.reduce((acc, { type, count }) => ({ ...acc, [type]: count }), {}),
      activeUsers
    };
  }

  static async getSecurityReport() {
    const permissionChanges = await Notification.findAll({
      where: { type: 'SECURITY' },
      order: [['createdAt', 'DESC']],
      limit: 10
    });

    const roleDistribution = await Role.findAll({
      attributes: ['type', [sequelize.fn('COUNT', 'id'), 'count']],
      group: ['type']
    });

    return {
      permissionChanges,
      roleDistribution
    };
  }
}
