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
});
