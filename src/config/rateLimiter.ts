import { RateLimiterRedis } from 'rate-limiter-flexible';
import { redisClient } from './redis';

const rateLimiter = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: 'rate_limit',
  points: 100, // Requêtes par minute
  duration: 60,
  blockDuration: 300 // Blocage 5min si dépassement
});

export const rateLimitMiddleware = async (req, res, next) => {
  try {
    await rateLimiter.consume(req.ip);
    next();
  } catch (e) {
    res.status(429).json({ error: 'Too many requests' });
  }
};
