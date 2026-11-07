import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

export interface HealthStatus {
  status: 'ok' | 'degraded';
  uptimeSeconds: number;
  timestamp: string;
  database: 'connected' | 'disconnected';
}

@Injectable()
export class HealthService {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  getStatus(): HealthStatus {
    const database = this.dataSource.isInitialized
      ? 'connected'
      : 'disconnected';

    return {
      status: database === 'connected' ? 'ok' : 'degraded',
      uptimeSeconds: Math.round(process.uptime()),
      timestamp: new Date().toISOString(),
      database,
    };
  }
}
