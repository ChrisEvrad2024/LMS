import { Course, User } from '../models';
import { redisClient } from '../config/redis';
import { logAction } from '../utils/auditTrail';

const COURSE_CACHE_TTL = 1800; // 30 minutes

export class CourseService {
  static async createCourse(req: Request, data: {
    title: string;
    description: string;
  }) {
    const course = await Course.create({
      ...data,
      creatorId: req.user.id
    });

    await logAction(req, 'create', 'course', course.id);
    return course;
  }

  static async getCourseWithCache(courseId: string) {
    const cacheKey = `course:${courseId}`;
    const cached = await redisClient.get(cacheKey);
    
    if (cached) return JSON.parse(cached);

    const course = await Course.findByPk(courseId, {
      include: [User]
    });

    await redisClient.setEx(cacheKey, COURSE_CACHE_TTL, JSON.stringify(course));
    return course;
  }
}
