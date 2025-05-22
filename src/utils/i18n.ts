import fs from 'fs';
import path from 'path';
import { Language, SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE } from '../config/i18n';

type Translations = Record<string, any>;

const translationsCache: Record<Language, Translations> = {} as Record<Language, Translations>;

// Chargement des fichiers de traduction
export const loadTranslations = (): void => {
  SUPPORTED_LANGUAGES.forEach(lang => {
    try {
      const filePath = path.join(__dirname, `../../src/locales/${lang}.json`);
      translationsCache[lang] = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    } catch (error) {
      console.error(`Failed to load ${lang} translations:`, error);
      translationsCache[lang] = {};
    }
  });
};

// Accès aux traductions avec fallback
export const t = (key: string, lang: Language = DEFAULT_LANGUAGE): string => {
  const keys = key.split('.');
  let result: any = translationsCache[lang] || translationsCache[DEFAULT_LANGUAGE];

  for (const k of keys) {
    result = result?.[k];
    if (result === undefined) {
      // Fallback vers la langue par défaut si la clé n'existe pas
      if (lang !== DEFAULT_LANGUAGE) {
        return t(key, DEFAULT_LANGUAGE);
      }
      return key; // Retourne la clé si aucune traduction trouvée
    }
  }

  return result;
};

// Initialisation au démarrage
loadTranslations();
