import { Request, Response, NextFunction } from 'express';
import { detectLanguage } from '../config/i18n';
import { t } from '../utils/i18n';

declare global {
  namespace Express {
    interface Request {
      t: (key: string) => string;
      language: string;
    }
  }
}

export const i18nMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const language = detectLanguage(req);
  req.language = language;
  
  // Ajoute la fonction de traduction à la requête
  req.t = (key: string) => t(key, language as any);

  // Ajoute le header Content-Language
  res.setHeader('Content-Language', language);

  next();
};
