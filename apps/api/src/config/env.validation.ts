import * as Joi from 'joi';

export const envValidationSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'test', 'production')
    .default('development'),
  API_PORT: Joi.number().default(3000),

  DB_HOST: Joi.string().required(),
  DB_PORT: Joi.number().default(5432),
  DB_USER: Joi.string().required(),
  DB_PASSWORD: Joi.string().required(),
  DB_NAME: Joi.string().required(),

  JWT_ACCESS_SECRET: Joi.string().min(16).required(),
  JWT_REFRESH_SECRET: Joi.string().min(16).required(),
  JWT_ACCESS_EXPIRES_IN: Joi.string().default('15m'),
  JWT_REFRESH_EXPIRES_IN: Joi.string().default('7d'),

  // Optional: GitHub login is inactive (routes 501) until these are set.
  GITHUB_CLIENT_ID: Joi.string().allow('').default(''),
  GITHUB_CLIENT_SECRET: Joi.string().allow('').default(''),
  GITHUB_CALLBACK_URL: Joi.string().allow('').default(''),
  MOBILE_DEEP_LINK_URL: Joi.string().default('codequest://auth-callback'),

  PISTON_API_URL: Joi.string().default('http://localhost:2000'),

  // Optional: the Fase 5A generator and Fase 5B tutor are inactive until
  // this is set (see AiService.isEnabled).
  GEMINI_API_KEY: Joi.string().allow('').default(''),

  // Optional: comma-separated emails that may read admin-only endpoints (the
  // analytics summary). Empty means nobody can — there is no admin role.
  ADMIN_EMAILS: Joi.string().allow('').default(''),

  // Optional: SMTP account that sends the instructor sign-in codes. Without
  // SMTP_HOST the code is only logged (development) and sending fails in
  // production.
  SMTP_HOST: Joi.string().allow('').default(''),
  SMTP_PORT: Joi.number().default(587),
  SMTP_USER: Joi.string().allow('').default(''),
  SMTP_PASS: Joi.string().allow('').default(''),
  MAIL_FROM: Joi.string().default('CodeQuest <no-reply@codequest.app>'),
  // Comma-separated email domains allowed to sign in as instructors.
  INSTRUCTOR_EMAIL_DOMAINS: Joi.string().allow('').default('sena.edu.co'),

  // Backs the Fase 5A.3 BullMQ exercise-generation queue.
  REDIS_HOST: Joi.string().default('localhost'),
  REDIS_PORT: Joi.number().default(6379),
});
