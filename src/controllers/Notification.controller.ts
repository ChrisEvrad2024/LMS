import { Request, Response } from 'express';
import { NotificationService } from '../services/Notification.service';
import { apiResponse } from '../utils/apiResponse';

export class NotificationController {
  static async getNotifications(req: Request, res: Response) {
    try {
      const notifications = await NotificationService.getUserNotifications(req.user.id);
      return apiResponse(res, 200, 'Notifications fetched', { notifications });
    } catch (error) {
      return apiResponse(res, 500, error.message);
    }
  }

  static async markNotificationAsRead(req: Request, res: Response) {
    try {
      await NotificationService.markAsRead(req.params.id);
      return apiResponse(res, 200, 'Notification marked as read');
    } catch (error) {
      return apiResponse(res, 500, error.message);
    }
  }
}
