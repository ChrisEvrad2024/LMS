import { z } from 'zod';

const envSchema = z.object({
  DB_HOST: z.string(),
  DB_PORT: z.string().transform(Number),
  DB_NAME: z.string(),
  DB_USER: z.string(),
  DB_PASSWORD: z.string(),
  JWT_SECRET: z.string(),
  JWT_EXPIRES_IN: z.string(),
  PORT: z.string().transform(Number),
  NODE_ENV: z.enum(['development', 'production', 'test']),
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.string().transform(Number).optional(),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),
  SMTP_FROM: z.string().optional(),
});

export const env = envSchema.parse(process.env);
