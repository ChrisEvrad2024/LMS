import { createClient } from 'redis';
import { env } from './env';

const redisClient = createClient({
  url: env.REDIS_URL
});

redisClient.on('error', (err) => {
  console.error('Redis error:', err);
});

const connectRedis = async () => {
  try {
    await redisClient.connect();
    console.log('Connected to Redis');
  } catch (err) {
    console.error('Redis connection error:', err);
    process.exit(1);
  }
};

export { redisClient, connectRedis };
