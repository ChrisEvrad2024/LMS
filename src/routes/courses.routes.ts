import express from 'express';
import { CoursesController } from '../controllers/courses.controller';
import { authenticate, requireRole } from '../middleware/auth.middleware';
import { ROLES } from '../constants/roles';

const router = express.Router();

router.post('/', 
  authenticate, 
  requireRole([ROLES.FORMATEUR, ROLES.ADMIN]), 
  CoursesController.createCourse
);

router.get('/', CoursesController.listCourses);
router.get('/:id', CoursesController.getCourseDetails);

export default router;
