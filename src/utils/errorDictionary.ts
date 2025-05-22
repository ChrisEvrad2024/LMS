import { SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE } from '../config/i18n';

export interface ErrorDefinition {
  message: Record<typeof SUPPORTED_LANGUAGES[number], string> | string;
  httpStatus: number;
  logLevel: 'error' | 'warn' | 'info';
}

export const ErrorDictionary = {
  // Auth Errors (1xxx)
  1001: {
    message: 'errors.1001', // Référence aux fichiers de traduction
    httpStatus: 401,
    logLevel: 'warn'
  },
  1002: {
    message: 'errors.1002',
    httpStatus: 400,
    logLevel: 'warn'
  },
  1003: {
    message: 'errors.1003',
    httpStatus: 400,
    logLevel: 'warn'
  },
  1004: {
    message: 'errors.1004',
    httpStatus: 400,
    logLevel: 'warn'
  },
  1005: {
    message: 'errors.1005',
    httpStatus: 403,
    logLevel: 'warn'
  },
  1006: {
    message: 'errors.1006',
    httpStatus: 404,
    logLevel: 'warn'
  },
  1007: {
    message: 'errors.1007',
    httpStatus: 401,
    logLevel: 'warn'
  },
  1008: {
    message: 'errors.1008',
    httpStatus: 404,
    logLevel: 'warn'
  },

  // System Errors (9xxx)
  9001: {
    message: 'errors.9001',
    httpStatus: 500,
    logLevel: 'error'
  }
} as const;

export type ErrorCode = keyof typeof ErrorDictionary;
