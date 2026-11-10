import { HttpStatus, Injectable } from '@nestjs/common';
import { Role } from '../common/constants/role.enum.js';
import { AccountsRepository } from './repositories/accounts.repository.js';
import { PasswordHasher } from '../utils/security/password-hasher.js';
import { randomUUID } from 'crypto';
import { Account, PublicAccount } from './domain/account.types.js';
import { ErrorCode } from '../common/constants/error-code.enum.js';
import { ApiException } from '../common/exceptions/api.exception.js';
import { AccountStatus } from './domain/account-status.enum.js';
import { normalizeEmail } from '../common/utils/normalize.util.js';

export interface CreateAccountInput {
    email: string;
    password: string;
    role: Role;
    userId: string;
}


@Injectable()
export class AccountsService {
    private readonly dummyHash: Promise<string>;

    constructor(
        private readonly accounts: AccountsRepository,
        private readonly hasher: PasswordHasher
    ) {
        this.dummyHash = this.hasher.hash(randomUUID());
    }

    /**
     * Creates a new account with the provided input. It first normalizes the email and checks if it already exists in the database. If the email is already registered, it throws an ApiException with a conflict status. If the email is unique, it hashes the password, creates a new account record, and returns the public representation of the account.
     * @param input 
     * @returns 
     */
    async create(input: CreateAccountInput): Promise<PublicAccount> {
        const email = normalizeEmail(input.email);
        if (await this.accounts.findByEmail(email)) {
            throw new ApiException(
                HttpStatus.CONFLICT,
                ErrorCode.EMAIL_ALREADY_EXISTS,
                'Email already registered',
            );
        }

        const now = new Date();
        const saved = await this.accounts.create({
            id: randomUUID(),
            email,
            passwordHash: await this.hasher.hash(input.password),
            role: input.role,
            userId: input.userId,
            status: AccountStatus.ACTIVE,
            lastLoginAt: null,
            createdAt: now,
            updatedAt: now,
        });
        return this.toPublic(saved);
    }

    async findById(id: string): Promise<PublicAccount> {
        return this.toPublic(await this.findOrThrow(id));
    }

    async authenticate(email: string, password: string): Promise<PublicAccount> {
        const account = await this.accounts.findByEmail(normalizeEmail(email));
        const matched = await this.hasher.verify(
            password,
            account?.passwordHash ?? (await this.dummyHash),
        );
        if (!account || !matched) {
            throw new ApiException(
                HttpStatus.UNAUTHORIZED,
                ErrorCode.INVALID_CREDENTIALS,
                'Invalid email or password',
            );
        }
        if (account.status !== AccountStatus.ACTIVE) {
            throw new ApiException(
                HttpStatus.FORBIDDEN,
                ErrorCode.ACCOUNT_SUSPENDED,
                'Account is suspended',
            );
        }

        const updated = await this.accounts.update({
            ...account,
            lastLoginAt: new Date(),
        });
        return this.toPublic(updated);
    }

    async updateStatus(
        id: string,
        status: AccountStatus,
    ): Promise<PublicAccount> {
        const account = await this.findOrThrow(id);
        if (account.role === Role.ADMIN) {
            throw new ApiException(
                HttpStatus.FORBIDDEN,
                ErrorCode.ACCOUNT_PROTECTED,
                'Admin account status cannot be changed',
            );
        }

        const updated = await this.accounts.update({
            ...account,
            status,
            updatedAt: new Date(),
        });
        return this.toPublic(updated);
    }

    private async findOrThrow(id: string): Promise<Account> {
        const account = await this.accounts.findById(id);
        if (!account) {
            throw new ApiException(
                HttpStatus.NOT_FOUND,
                ErrorCode.ACCOUNT_NOT_FOUND,
                'Account not found',
            );
        }
        return account;
    }

    async existsByEmail(email: string): Promise<boolean> {
        return !!(await this.accounts.findByEmail(normalizeEmail(email)));
    }

    private toPublic(account: Account): PublicAccount {
        return {
            id: account.id,
            email: account.email,
            role: account.role,
            userId: account.userId,
            status: account.status,
            lastLoginAt: account.lastLoginAt,
            createdAt: account.createdAt,
            updatedAt: account.updatedAt,
        };
    }
}
