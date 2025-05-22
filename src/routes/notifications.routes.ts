import { Router } from 'express';
import { NotificationController } from '../controllers/Notification.controller';
import { requireRole } from '../middleware/rbac.middleware';
import { ROLES } from '../config/constants';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Notifications
 *   description: System notifications management
 */

/**
 * @swagger
 * /notifications:
 *   post:
 *     summary: Create a new notification
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - type
 *               - message
 *             properties:
 *               userId:
 *                 type: string
 *                 format: uuid
 *                 description: Target user ID
 *               type:
 *                 type: string
 *                 enum: [SYSTEM, COURSE, SECURITY]
 *               message:
 *                 type: string
 *                 minLength: 5
 *     responses:
 *       201:
 *         description: Notification created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Notification'
 *       400:
 *         description: Invalid input
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               error:
 *                 code: 4001
 *                 message: Invalid notification type
 *                 details: Allowed types: SYSTEM, COURSE, SECURITY
 */

router.post('/', 
  requireRole([ROLES.ADMIN]), 
  NotificationController.createNotification
);

/**
 * @swagger
 * /notifications/bulk:
 *   post:
 *     summary: Create multiple notifications
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               $ref: '#/components/schemas/Notification'
 *     responses:
 *       207:
 *         description: Multi-status response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: integer
 *                 failed:
 *                   type: integer
 *                 results:
 *                   type: array
 *                   items:
 *                     oneOf:
 *                       - $ref: '#/components/schemas/Notification'
 *                       - $ref: '#/components/schemas/Error'
 */

router.post('/bulk',
  requireRole([ROLES.ADMIN]),
  NotificationController.bulkCreateNotifications
);

export default router;
