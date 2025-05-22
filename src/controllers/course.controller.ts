import { Request, Response } from 'express';
import { CourseService } from '../services/course.service';
import { requireRole } from '../middleware/rbac.middleware';
import { apiResponse } from '../utils/apiResponse';

export class CourseController {
  static async create(req: Request, res: Response) {
    try {
      const course = await CourseService.createCourse(req, req.body);
      apiResponse(res, 201, 'Course created', course);
    } catch (error) {
      apiResponse(res, 500, 'Error creating course');
    }
  }

  static async getById(req: Request, res: Response) {
    try {
      const course = await CourseService.getCourseWithCache(req.params.id);
      if (!course) return apiResponse(res, 404, 'Course not found');
      apiResponse(res, 200, 'Course retrieved', course);
    } catch (error) {
      apiResponse(res, 500, 'Error fetching course');
    }
  }
}
