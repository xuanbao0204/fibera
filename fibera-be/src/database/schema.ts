import { sql } from 'drizzle-orm';
import {
    bigint,
    boolean,
    index,
    pgEnum,
    pgTable,
    text,
    timestamp,
    uniqueIndex,
    uuid,
} from 'drizzle-orm/pg-core';
import type { Role } from '../common/constants/role.enum.js';
import type { AccountStatus } from '../accounts/domain/index.js';

export const roleEnum = pgEnum('role', ['tenant', 'landlord', 'admin']);
export const accountStatusEnum = pgEnum('account_status', ['active', 'suspended']);

const timestamps = {
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
};

const profileColumns = {
    id: uuid('id').primaryKey().defaultRandom(),
    fullName: text('full_name').notNull(),
    phone: text('phone').notNull(),
    avatarUrl: text('avatar_url'),
};

export const tenants = pgTable('tenants', {
    ...profileColumns,
    occupation: text('occupation'),
    budgetMin: bigint('budget_min', { mode: 'number' }),
    budgetMax: bigint('budget_max', { mode: 'number' }),
    ...timestamps,
});

export const landlords = pgTable('landlords', {
    ...profileColumns,
    address: text('address'),
    verified: boolean('verified').notNull().default(false),
    ...timestamps,
});

export const admins = pgTable(
    'admins',
    {
        ...profileColumns,
        isSuperAdmin: boolean('is_super_admin').notNull().default(false),
        ...timestamps,
    },
    (t) => [
        uniqueIndex('admins_single_super_admin')
            .on(t.isSuperAdmin)
            .where(sql`${t.isSuperAdmin} = true`),
    ],
);

export const accounts = pgTable('accounts', {
    id: uuid('id').primaryKey().defaultRandom(),
    email: text('email').notNull().unique(),
    passwordHash: text('password_hash').notNull(),
    role: roleEnum('role').$type<Role>().notNull(),
    userId: uuid('user_id').notNull().unique(),
    status: accountStatusEnum('status')
        .$type<AccountStatus>()
        .notNull()
        .default(sql`'active'`),
    lastLoginAt: timestamp('last_login_at', { withTimezone: true }),
    ...timestamps,
});

export const refreshTokens = pgTable(
    'refresh_tokens',
    {
        id: uuid('id').primaryKey().defaultRandom(),
        accountId: uuid('account_id')
            .notNull()
            .references(() => accounts.id, { onDelete: 'cascade' }),
        familyId: uuid('family_id').notNull(),
        tokenHash: text('token_hash').notNull().unique(),
        expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
        revokedAt: timestamp('revoked_at', { withTimezone: true }),
        createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    },
    (t) => [
        index('refresh_tokens_family_idx').on(t.familyId),
        index('refresh_tokens_account_idx').on(t.accountId),
    ],
);