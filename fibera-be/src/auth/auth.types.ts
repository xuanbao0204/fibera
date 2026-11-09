import { Request } from 'express';
import type { PublicAccount } from '../accounts/domain/index.js';
import type { Role } from '../common/constants/role.enum.js';

export interface JwtPayload {
    sub: string;
    role: Role;
}

export interface RegisterInput {
    email: string;
    password: string;
    fullName: string;
    phone: string;
    role: Role;
}

export interface AuthResult {
    account: PublicAccount;
    accessToken: string;
}

export type AuthenticatedRequest = Request & { account: PublicAccount };