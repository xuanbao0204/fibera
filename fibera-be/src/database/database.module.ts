import { Global, Inject, Logger, Module, OnApplicationShutdown } from '@nestjs/common';
import { drizzle, type NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from './schema.js';
import { ConfigService } from '@nestjs/config';
import pg from 'pg';

export const PG_POOL = Symbol('PG_POOL');
export const DRIZZLE = Symbol('DRIZZLE');
export type Database = NodePgDatabase<typeof schema>;

@Global()
@Module({
    providers: [
        {
            provide: PG_POOL,
            inject: [ConfigService],
            useFactory: (config: ConfigService) => {
                const logger = new Logger('Database');
                const pool = new pg.Pool({
                    connectionString: config.getOrThrow<string>('DATABASE_URL'),
                    max: 10,
                    idleTimeoutMillis: 30_000,
                    connectionTimeoutMillis: 10_000,
                });
                pool.on('error', (err) => logger.error(`Idle client error: ${err.message}`));
                return pool;
            },
        },
        {
            provide: DRIZZLE,
            inject: [PG_POOL],
            useFactory: (pool: pg.Pool): Database => drizzle(pool, { schema }),
        },
    ],
    exports: [DRIZZLE],
})
export class DatabaseModule implements OnApplicationShutdown {
    constructor(@Inject(PG_POOL) private readonly pool: pg.Pool) { }

    async onApplicationShutdown(): Promise<void> {
        await this.pool.end();
    }
}