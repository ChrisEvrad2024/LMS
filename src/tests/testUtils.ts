import { redisClient } from '../config/redis';
import { AppDataSource } from '../config/database';

export const setupTestEnvironment = async () => {
  // Clear Redis
  await redisClient.flushAll();
  
  // Reset database
  await AppDataSource.synchronize(true);
};

export const teardownTestEnvironment = async () => {
  await redisClient.quit();
  await AppDataSource.destroy();
};
