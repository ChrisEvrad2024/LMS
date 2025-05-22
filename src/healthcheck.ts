import http from 'http';
import { redisClient } from './config/redis';
import { AppDataSource } from './config/database';

const server = http.createServer(async (req, res) => {
  try {
    // Check database connection
    await AppDataSource.query('SELECT 1');
    
    // Check Redis connection
    await redisClient.ping();

    res.writeHead(200);
    res.end('OK');
  } catch (err) {
    res.writeHead(500);
    res.end('Service Unhealthy');
  }
});

server.listen(3001);
