import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { User } from '../models/core/User.model';
import { apiResponse } from '../utils/apiResponse';

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return apiResponse(res, 401, 'Authentication required');
    }

    const decoded = jwt.verify(token, env.JWT_SECRET) as { userId: string };
    const user = await User.findByPk(decoded.userId);
    if (!user) {
      return apiResponse(res, 401, 'User not found');
    }

    req.user = user;
    next();
  } catch (error) {
    return apiResponse(res, 401, 'Invalid token');
  }
};
