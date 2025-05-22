import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { i18nMiddleware } from './middleware/i18nMiddleware';
import { errorMiddleware } from './middleware/errorMiddleware';
import { loadTranslations } from './utils/i18n';
import authRoutes from './routes/auth.routes';
import courseRoutes from './routes/course.routes';

// Initialiser les traductions
loadTranslations();

const app = express();

// Middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(i18nMiddleware);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);

// Gestion des erreurs
app.use(errorMiddleware);

export default app;
