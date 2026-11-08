import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

// pgvector's `vector` type isn't something TypeORM/`synchronize` understands,
// so `Exercise.embedding` is never declared as a @Column — it's managed here
// with raw, idempotent SQL instead, run once at boot. Wrapped in try/catch
// (not awaited-and-thrown) so a managed Postgres host that doesn't allow
// CREATE EXTENSION (or already has it pre-enabled) never blocks the app from
// starting; it just can't do embedding-based dedup until pgvector is on.
//
// HNSW over ivfflat: the index is built against an empty/near-empty table at
// boot, and ivfflat needs a representative sample at creation time to pick a
// good `lists` value, which we don't have yet.
@Injectable()
export class DatabaseBootstrapService implements OnModuleInit {
  private readonly logger = new Logger(DatabaseBootstrapService.name);

  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  async onModuleInit(): Promise<void> {
    try {
      await this.dataSource.query('CREATE EXTENSION IF NOT EXISTS vector');
      await this.dataSource.query(
        'ALTER TABLE exercises ADD COLUMN IF NOT EXISTS embedding vector(1536)',
      );
      await this.dataSource.query(
        'CREATE INDEX IF NOT EXISTS exercises_embedding_hnsw_idx ' +
          'ON exercises USING hnsw (embedding vector_cosine_ops)',
      );
    } catch (error) {
      this.logger.warn(
        `pgvector bootstrap skipped (embedding dedup unavailable): ${
          error instanceof Error ? error.message : String(error)
        }`,
      );
    }
  }
}
