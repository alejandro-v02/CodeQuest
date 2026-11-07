import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import configuration, { AppConfig } from './config/configuration';
import { envValidationSchema } from './config/env.validation';
import { HealthModule } from './modules/health/health.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['../../.env'],
      load: [configuration],
      validationSchema: envValidationSchema,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService<AppConfig, true>) => ({
        type: 'postgres',
        host: configService.get('database', { infer: true }).host,
        port: configService.get('database', { infer: true }).port,
        username: configService.get('database', { infer: true }).username,
        password: configService.get('database', { infer: true }).password,
        database: configService.get('database', { infer: true }).name,
        autoLoadEntities: true,
        // Never use schema auto-sync outside local development (see PLAN.md, section 6).
        synchronize:
          configService.get('nodeEnv', { infer: true }) === 'development',
      }),
    }),
    HealthModule,
  ],
})
export class AppModule {}
