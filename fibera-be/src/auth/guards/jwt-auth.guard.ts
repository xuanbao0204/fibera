import {
    CanActivate,
    ExecutionContext,
    HttpStatus,
    Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import type { Request } from 'express';
import { AccountsService } from '../../accounts/accounts.service.js';
import { AccountStatus } from '../../accounts/domain/index.js';
import type { PublicAccount } from '../../accounts/domain/index.js';
import { ErrorCode } from '../../common/constants/error-code.enum.js';
import { ApiException } from '../../common/exceptions/api.exception.js';
import { ACCESS_TOKEN_COOKIE, IS_PUBLIC_KEY } from '../auth.constants.js';
import type { AuthenticatedRequest, JwtPayload } from '../auth.types.js';

@Injectable()
export class JwtAuthGuard implements CanActivate {
    constructor(
        private readonly reflector: Reflector,
        private readonly jwt: JwtService,
        private readonly accounts: AccountsService,
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const isPublic = this.reflector.getAllAndOverride<boolean | undefined>(
            IS_PUBLIC_KEY,
            [context.getHandler(), context.getClass()],
        );
        if (isPublic) {
            return true;
        }

        const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
        const token = this.extractToken(request);
        if (!token) {
            throw this.unauthorized();
        }

        const account = await this.resolveAccount(token);
        if (account.status !== AccountStatus.ACTIVE) {
            throw new ApiException(
                HttpStatus.FORBIDDEN,
                ErrorCode.ACCOUNT_SUSPENDED,
                'Account is suspended',
            );
        }

        request.account = account;
        return true;
    }

    private extractToken(request: Request): string | null {
        const cookies = request.cookies as Record<string, unknown> | undefined;
        const cookieToken = cookies?.[ACCESS_TOKEN_COOKIE];
        if (typeof cookieToken === 'string' && cookieToken) {
            return cookieToken;
        }

        const [type, value] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' && value ? value : null;
    }

    private async resolveAccount(token: string): Promise<PublicAccount> {
        try {
            const payload = await this.jwt.verifyAsync<JwtPayload>(token);
            return await this.accounts.findById(payload.sub);
        } catch {
            throw this.unauthorized();
        }
    }

    private unauthorized(): ApiException {
        return new ApiException(
            HttpStatus.UNAUTHORIZED,
            ErrorCode.UNAUTHORIZED,
            'Authentication required',
        );
    }
}