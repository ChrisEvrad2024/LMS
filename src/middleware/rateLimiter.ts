import { Request, Response, NextFunction } from 'express';
import { redisClient } from '../config/redis';
import { apiResponse } from '../utils/apiResponse';

const WINDOW_SIZE_IN_SECONDS = 60;
const MAX_REQUESTS_PER_WINDOW = 100;

export const rateLimiter = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const ip = req.ip || 'unknown';
  const key = `rate_limit:${ip}`;

  try {
    const current = await redisClient.incr(key);
    
    if (current === 1) {
      await redisClient.expire(key, WINDOW_SIZE_IN_SECONDS);
    }

    if (current > MAX_REQUESTS_PER_WINDOW) {
      return apiResponse(res, 429, 'Too many requests');
    }

    next();
  } catch (err) {
    console.error('Rate limiter error:', err);
    next(); // Fail open
  }
};
