import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import type { Account } from '../domain/index.js';
import { AccountsRepository } from './accounts.repository.js';
import { DRIZZLE } from '../../database/database.module.js';
import type { Database } from '../../database/database.module.js';
import { accounts } from '../../database/schema.js';
import { isUniqueViolation } from '../../database/pg-errors.js';
import { ApiException } from '../../common/exceptions/api.exception.js';
import { ErrorCode } from '../../common/constants/error-code.enum.js';

@Injectable()
export class DrizzleAccountsRepository extends AccountsRepository {
    constructor(@Inject(DRIZZLE) private readonly db: Database) {
        super();
    }

    async create(account: Account): Promise<Account> {
        try {
            const [row] = await this.db.insert(accounts).values(account).returning();
            return row;
        } catch (error) {
            if (isUniqueViolation(error)) {
                throw new ApiException(
                    HttpStatus.CONFLICT,
                    ErrorCode.EMAIL_ALREADY_EXISTS,
                    'Email already registered',
                );
            }
            throw error;
        }
    }

    async findById(id: string): Promise<Account | null> {
        const [row] = await this.db.select().from(accounts).where(eq(accounts.id, id)).limit(1);
        return row ?? null;
    }

    async findByEmail(email: string): Promise<Account | null> {
        const [row] = await this.db.select().from(accounts).where(eq(accounts.email, email)).limit(1);
        return row ?? null;
    }

    async findByUserId(userId: string): Promise<Account | null> {
        const [row] = await this.db.select().from(accounts).where(eq(accounts.userId, userId)).limit(1);
        return row ?? null;
    }

    async update(account: Account): Promise<Account> {
        const { id, createdAt, ...changes } = account;
        const [row] = await this.db
            .update(accounts)
            .set(changes)
            .where(eq(accounts.id, id))
            .returning();
        if (!row) throw new Error(`Account ${id} not found`);
        return row;
    }
}