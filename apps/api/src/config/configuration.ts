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
});
