import 'reflect-metadata';
import { AppDataSource } from '../config/database';
import { redisClient } from '../config/redis';

beforeAll(async () => {
  await AppDataSource.initialize();
  await redisClient.connect();
});

afterAll(async () => {
  await redisClient.quit();
  await AppDataSource.destroy();
});
