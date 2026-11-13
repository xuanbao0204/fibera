import { Inject, Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { Role } from '../../common/constants/role.enum.js';
import type { Admin, Landlord, Tenant, UserOf } from '../domain/index.js';
import { UsersRepository } from './users.repository.js';
import { DRIZZLE } from '../../database/database.module.js';
import type { Database } from '../../database/database.module.js';
import { admins, landlords, tenants } from '../../database/schema.js';

@Injectable()
export class DrizzleUsersRepository extends UsersRepository {
    constructor(@Inject(DRIZZLE) private readonly db: Database) {
        super();
    }

    async create<R extends Role>(role: R, user: UserOf<R>): Promise<UserOf<R>> {
        switch (role) {
            case Role.TENANT: {
                const [row] = await this.db.insert(tenants).values(user as Tenant).returning();
                return this.as<R>(row);
            }
            case Role.LANDLORD: {
                const [row] = await this.db.insert(landlords).values(user as Landlord).returning();
                return this.as<R>(row);
            }
            case Role.ADMIN: {
                const [row] = await this.db.insert(admins).values(user as Admin).returning();
                return this.as<R>(row);
            }
        }
        throw new Error(`Unsupported role: ${String(role)}`);
    }

    async findById<R extends Role>(role: R, id: string): Promise<UserOf<R> | null> {
        switch (role) {
            case Role.TENANT: {
                const [row] = await this.db.select().from(tenants).where(eq(tenants.id, id)).limit(1);
                return row ? this.as<R>(row) : null;
            }
            case Role.LANDLORD: {
                const [row] = await this.db.select().from(landlords).where(eq(landlords.id, id)).limit(1);
                return row ? this.as<R>(row) : null;
            }
            case Role.ADMIN: {
                const [row] = await this.db.select().from(admins).where(eq(admins.id, id)).limit(1);
                return row ? this.as<R>(row) : null;
            }
        }
        throw new Error(`Unsupported role: ${String(role)}`);
    }

    async update<R extends Role>(role: R, user: UserOf<R>): Promise<UserOf<R>> {
        switch (role) {
            case Role.TENANT: {
                const { id, createdAt, ...changes } = user as Tenant;
                const [row] = await this.db.update(tenants).set(changes).where(eq(tenants.id, id)).returning();
                if (!row) throw new Error(`User ${id} not found`);
                return this.as<R>(row);
            }
            case Role.LANDLORD: {
                const { id, createdAt, ...changes } = user as Landlord;
                const [row] = await this.db.update(landlords).set(changes).where(eq(landlords.id, id)).returning();
                if (!row) throw new Error(`User ${id} not found`);
                return this.as<R>(row);
            }
            case Role.ADMIN: {
                const { id, createdAt, ...changes } = user as Admin;
                const [row] = await this.db.update(admins).set(changes).where(eq(admins.id, id)).returning();
                if (!row) throw new Error(`User ${id} not found`);
                return this.as<R>(row);
            }
        }
        throw new Error(`Unsupported role: ${String(role)}`);
    }

    async delete(role: Role, id: string): Promise<void> {
        switch (role) {
            case Role.TENANT:
                await this.db.delete(tenants).where(eq(tenants.id, id));
                return;
            case Role.LANDLORD:
                await this.db.delete(landlords).where(eq(landlords.id, id));
                return;
            case Role.ADMIN:
                await this.db.delete(admins).where(eq(admins.id, id));
                return;
        }
    }

    private as<R extends Role>(row: unknown): UserOf<R> {
        return row as UserOf<R>;
    }
}