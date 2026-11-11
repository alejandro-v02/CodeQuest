import type { StringValue } from 'ms';

export interface AppConfig {
  nodeEnv: string;
  port: number;
  database: {
    host: string;
    port: number;
    username: string;
    password: string;
    name: string;
  };
  jwt: {
    accessSecret: string;
    refreshSecret: string;
    // Validated by Joi as a non-empty string (env.validation.ts); cast here
    // to the "ms"-style duration type jsonwebtoken's SignOptions expects.
    accessExpiresIn: StringValue;
    refreshExpiresIn: StringValue;
  };
  github: {
    enabled: boolean;
    clientId: string;
    clientSecret: string;
    callbackUrl: string;
  };
  // Custom URL scheme the mobile app registers to receive the GitHub OAuth
  // callback's tokens (see AndroidManifest.xml and DeepLinkService).
  mobileDeepLinkUrl: string;
  execution: {
    pistonApiUrl: string;
  };
  gemini: {
    enabled: boolean;
    apiKey: string;
  };
  redis: {
    host: string;
    port: number;
  };
  // Lowercased emails allowed to read admin-only endpoints (see AdminGuard).
  adminEmails: string[];
  // SMTP account used to send verification codes. With no host configured the
  // code is only logged, and only in development (see MailService).
  mail: {
    host: string;
    port: number;
    user: string;
    pass: string;
    from: string;
  };
  // Domains whose email owners may sign in as instructors. Matched exactly
  // after the "@", so "sena.edu.co" does not match "misena.edu.co".
  instructorEmailDomains: string[];
}

export default (): AppConfig => ({
  nodeEnv: process.env.NODE_ENV ?? 'development',
  port: parseInt(process.env.API_PORT ?? '3000', 10),
  database: {
    host: process.env.DB_HOST ?? 'localhost',
    port: parseInt(process.env.DB_PORT ?? '5432', 10),
    username: process.env.DB_USER ?? 'codequest',
    password: process.env.DB_PASSWORD ?? 'codequest',
    name: process.env.DB_NAME ?? 'codequest',
  },
  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET ?? '',
    refreshSecret: process.env.JWT_REFRESH_SECRET ?? '',
    accessExpiresIn: (process.env.JWT_ACCESS_EXPIRES_IN ??
      '15m') as StringValue,
    refreshExpiresIn: (process.env.JWT_REFRESH_EXPIRES_IN ??
      '7d') as StringValue,
  },
  github: {
    enabled: Boolean(
      process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET,
    ),
    // passport-github2 throws at construction time on an empty clientID/
    // clientSecret, so these fall back to harmless placeholders instead of
    // '' when GitHub login hasn't been configured yet.
    clientId: process.env.GITHUB_CLIENT_ID || 'not-configured',
    clientSecret: process.env.GITHUB_CLIENT_SECRET || 'not-configured',
    callbackUrl:
      process.env.GITHUB_CALLBACK_URL ||
      'http://localhost:3000/auth/github/callback',
  },
  mobileDeepLinkUrl:
    process.env.MOBILE_DEEP_LINK_URL ?? 'codequest://auth-callback',
  execution: {
    pistonApiUrl: process.env.PISTON_API_URL ?? 'http://localhost:2000',
  },
  gemini: {
    enabled: Boolean(process.env.GEMINI_API_KEY),
    apiKey: process.env.GEMINI_API_KEY ?? '',
  },
  redis: {
    host: process.env.REDIS_HOST ?? 'localhost',
    port: parseInt(process.env.REDIS_PORT ?? '6379', 10),
  },
  adminEmails: (process.env.ADMIN_EMAILS ?? '')
    .split(',')
    .map((email) => email.trim().toLowerCase())
    .filter((email) => email !== ''),
  mail: {
    host: process.env.SMTP_HOST ?? '',
    port: parseInt(process.env.SMTP_PORT ?? '587', 10),
    user: process.env.SMTP_USER ?? '',
    pass: process.env.SMTP_PASS ?? '',
    from: process.env.MAIL_FROM ?? 'CodeQuest <no-reply@codequest.app>',
  },
  instructorEmailDomains: (
    process.env.INSTRUCTOR_EMAIL_DOMAINS ?? 'sena.edu.co'
  )
    .split(',')
    .map((domain) => domain.trim().toLowerCase())
    .filter((domain) => domain !== ''),
});
