import express from 'express';
import { NotificationController } from '../controllers/Notification.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = express.Router();

router.get('/', authenticate, NotificationController.getNotifications);
router.patch('/:id/read', authenticate, NotificationController.markNotificationAsRead);

export default router;
