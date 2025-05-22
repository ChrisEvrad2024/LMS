import { Router } from 'express';
import { AnalyticsController } from '../controllers/Analytics.controller';
import { requireRole } from '../middleware/rbac.middleware';
import { ROLES } from '../config/constants';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Analytics
 *   description: System analytics and reporting
 */

/**
 * @swagger
 * /analytics/notifications:
 *   get:
 *     summary: Get notification analytics
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: timeframe
 *         schema:
 *           type: string
 *           enum: [day, week, month]
 *           default: week
 *     responses:
 *       200:
 *         description: Analytics report
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total:
 *                   type: integer
 *                 unread:
 *                   type: integer
 *                 byType:
 *                   type: object
 *                   additionalProperties:
 *                     type: integer
 *       403:
 *         description: Forbidden
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               error:
 *                 code: 2001
 *                 message: Missing required permission
 *                 details: Requires ADMIN role
 */

router.get('/notifications',
  requireRole([ROLES.ADMIN]),
  AnalyticsController.getNotificationAnalytics
);

export default router;
