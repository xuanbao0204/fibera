import { Inject, Injectable } from '@nestjs/common';
import { and, eq, isNull } from 'drizzle-orm';
import { DRIZZLE } from '../../database/database.module.js';
import type { Database } from '../../database/database.module.js';
import { refreshTokens } from '../../database/schema.js';
import type { RefreshToken } from './refresh-token.types.js';
import { RefreshTokensRepository } from './refresh-tokens.repository.js';

@Injectable()
export class DrizzleRefreshTokensRepository extends RefreshTokensRepository {
    constructor(@Inject(DRIZZLE) private readonly db: Database) {
        super();
    }

    async create(token: RefreshToken): Promise<RefreshToken> {
        const [row] = await this.db.insert(refreshTokens).values(token).returning();
        return row;
    }

    async findByHash(tokenHash: string): Promise<RefreshToken | null> {
        const [row] = await this.db
            .select()
            .from(refreshTokens)
            .where(eq(refreshTokens.tokenHash, tokenHash))
            .limit(1);
        return row ?? null;
    }

    async revoke(id: string): Promise<boolean> {
        const rows = await this.db
            .update(refreshTokens)
            .set({ revokedAt: new Date() })
            .where(and(eq(refreshTokens.id, id), isNull(refreshTokens.revokedAt)))
            .returning({ id: refreshTokens.id });
        return rows.length > 0;
    }

    async revokeFamily(familyId: string): Promise<void> {
        await this.db
            .update(refreshTokens)
            .set({ revokedAt: new Date() })
            .where(and(eq(refreshTokens.familyId, familyId), isNull(refreshTokens.revokedAt)));
    }
}