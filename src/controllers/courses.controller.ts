import { Request, Response } from 'express';
import { Course } from '../models/core/Course.model';
import { apiResponse } from '../utils/apiResponse';

export class CoursesController {
  static async createCourse(req: Request, res: Response) {
    try {
      const course = await Course.create(req.body);
      return apiResponse(res, 201, 'Course created', course);
    } catch (error) {
      return apiResponse(res, 500, 'Error creating course', error);
    }
  }

  static async listCourses(req: Request, res: Response) {
    const courses = await Course.findAll();
    return apiResponse(res, 200, 'Courses list', courses);
  }
}
