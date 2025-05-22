import express from 'express';
import { CourseController } from '../controllers/course.controller';
import { requireRole } from '../middleware/rbac.middleware';

const router = express.Router();

router.post('/',
  requireRole('INSTRUCTOR'),
  CourseController.create
);

router.get('/:id',
  requireRole('STUDENT'),
  CourseController.getById
);

export default router;
