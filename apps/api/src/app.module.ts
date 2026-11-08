import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';
import configuration, { AppConfig } from './config/configuration';
import { envValidationSchema } from './config/env.validation';
import { DatabaseModule } from './database/database.module';
import { HealthModule } from './modules/health/health.module';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { ConceptsModule } from './modules/concepts/concepts.module';
import { CoursesModule } from './modules/courses/courses.module';
import { ExercisesModule } from './modules/exercises/exercises.module';

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
    // App-wide default; auth endpoints override this with a tighter limit
    // (see AuthController) per PLAN.md section 6.
    ThrottlerModule.forRoot({
      throttlers: [{ limit: 60, ttl: 60_000 }],
    }),
    DatabaseModule,
    HealthModule,
    UsersModule,
    AuthModule,
    ConceptsModule,
    CoursesModule,
    ExercisesModule,
  ],
  providers: [{ provide: APP_GUARD, useClass: ThrottlerGuard }],
})
export class AppModule {}
