import { HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AccountsService } from '../accounts/accounts.service.js';
import type { PublicAccount } from '../accounts/domain/index.js';
import { ErrorCode } from '../common/constants/error-code.enum.js';
import {
    PUBLIC_REGISTER_ROLES,
    Role,
} from '../common/constants/role.enum.js';
import { ApiException } from '../common/exceptions/api.exception.js';
import { UsersService } from '../users/users.service.js';
import type { AuthResult, JwtPayload, RegisterInput } from './auth.types.js';
import { User } from '../users/domain/index.js';

@Injectable()
export class AuthService {
    constructor(
        private readonly users: UsersService,
        private readonly accounts: AccountsService,
        private readonly jwt: JwtService,
    ) { }

    async register(input: RegisterInput): Promise<AuthResult> {
        if (!PUBLIC_REGISTER_ROLES.includes(input.role)) {
            throw new ApiException(
                HttpStatus.FORBIDDEN,
                ErrorCode.ROLE_NOT_ALLOWED,
                'Role is not allowed for registration',
            );
        }

        const userId = await this.createProfile(input);
        try {
            const account = await this.accounts.create({
                email: input.email,
                password: input.password,
                role: input.role,
                userId,
            });
            return await this.issueToken(account);
        } catch (error) {
            await this.users.remove(input.role, userId);
            throw error;
        }
    }

    async login(email: string, password: string): Promise<AuthResult> {
        const account = await this.accounts.authenticate(email, password);
        return this.issueToken(account);
    }

    async getCurrent(account: PublicAccount,): Promise<{ account: PublicAccount; profile: User }> {
        const profile = await this.users.getById(account.role, account.userId);
        return { account, profile };
    }

    private async createProfile(input: RegisterInput): Promise<string> {
        const base = {
            fullName: input.fullName,
            phone: input.phone,
            avatarUrl: null,
        };

        if (input.role === Role.TENANT) {
            const tenant = await this.users.create(Role.TENANT, {
                ...base,
                occupation: null,
                budgetMin: null,
                budgetMax: null,
            });
            return tenant.id;
        }

        const landlord = await this.users.create(Role.LANDLORD, {
            ...base,
            address: null,
            verified: false,
        });
        return landlord.id;
    }

    private async issueToken(account: PublicAccount): Promise<AuthResult> {
        const payload: JwtPayload = { sub: account.id, role: account.role };
        return { account, accessToken: await this.jwt.signAsync(payload) };
    }
}