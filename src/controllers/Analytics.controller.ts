import { Request, Response } from 'express';
import { AnalyticsService } from '../services/Analytics.service';
import { apiResponse } from '../utils/apiResponse';

export class AnalyticsController {
  static async getNotificationReport(req: Request, res: Response) {
    try {
      const report = await AnalyticsService.getNotificationReport();
      return apiResponse(res, 200, 'Notification report', report);
    } catch (error) {
      return apiResponse(res, 500, error.message);
    }
  }

  static async getSecurityReport(req: Request, res: Response) {
    try {
      const report = await AnalyticsService.getSecurityReport();
      return apiResponse(res, 200, 'Security report', report);
    } catch (error) {
      return apiResponse(res, 500, error.message);
    }
  }
}
