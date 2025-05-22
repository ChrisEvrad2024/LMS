import express from 'express';
import cors from 'cors';
import { connectRedis } from './config/redis';
import { requestLogger } from './middleware/requestLogger';
import { rateLimiter } from './middleware/rateLimiter';
import { securityHeaders } from './middleware/securityHeaders';
import { i18nMiddleware } from './middleware/i18nMiddleware';
import { errorMiddleware } from './middleware/errorMiddleware';

const app = express();

// Initialize Redis
connectRedis();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(securityHeaders);
app.use(requestLogger);
app.use(rateLimiter);
app.use(i18nMiddleware);

// Routes would be added here

// Error handling (must be last)
app.use(errorMiddleware);

export default app;
