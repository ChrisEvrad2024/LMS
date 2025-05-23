import 'reflect-metadata';
import { AppDataSource } from '../config/database';
import { redisClient } from '../config/redis';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.test' });

beforeAll(async () => {
  try {
    await AppDataSource.initialize();
    await redisClient.connect();
  } catch (error) {
    console.error('Test setup failed:', error);
    process.exit(1);
  }
});

afterAll(async () => {
  try {
    await redisClient.quit();
    await AppDataSource.destroy();
  } catch (error) {
    console.error('Test teardown failed:', error);
  }
});
