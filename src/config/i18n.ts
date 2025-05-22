import { Request } from 'express';

// Configuration des langues supportées
export const SUPPORTED_LANGUAGES = ['fr', 'en', 'es'] as const;
export const DEFAULT_LANGUAGE = 'fr';

export type Language = typeof SUPPORTED_LANGUAGES[number];

// Détection de la langue
export const detectLanguage = (req: Request): Language => {
  // 1. Vérifier le paramètre de requête
  const queryLang = req.query.lang as Language;
  if (queryLang && SUPPORTED_LANGUAGES.includes(queryLang)) {
    return queryLang;
  }

  // 2. Vérifier le header Accept-Language
  const acceptLanguage = req.headers['accept-language'];
  if (acceptLanguage) {
    const primaryLang = acceptLanguage.split('-')[0].toLowerCase() as Language;
    if (SUPPORTED_LANGUAGES.includes(primaryLang)) {
      return primaryLang;
    }
  }

  // 3. Fallback sur la langue par défaut
  return DEFAULT_LANGUAGE;
};
