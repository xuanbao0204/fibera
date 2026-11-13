import { HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createHash, randomBytes, randomUUID } from 'crypto';
import { ErrorCode } from '../../common/constants/error-code.enum.js';
import { ApiException } from '../../common/exceptions/api.exception.js';
import { RefreshTokensRepository } from './refresh-tokens.repository.js';

export interface IssuedRefreshToken {
    token: string;
    familyId: string;
}

export interface RotatedRefreshToken extends IssuedRefreshToken {
    accountId: string;
}

@Injectable()
export class RefreshTokensService {
    private readonly ttlMs: number;

    constructor(
        private readonly repo: RefreshTokensRepository,
        config: ConfigService,
    ) {
        this.ttlMs =
            Number(config.getOrThrow<string>('REFRESH_TOKEN_EXPIRES_IN')) * 1000;
    }

    async issue(
        accountId: string,
        familyId: string = randomUUID(),
    ): Promise<IssuedRefreshToken> {
        const token = randomBytes(48).toString('base64url');
        const now = new Date();
        await this.repo.create({
            id: randomUUID(),
            accountId,
            familyId,
            tokenHash: this.hash(token),
            expiresAt: new Date(now.getTime() + this.ttlMs),
            revokedAt: null,
            createdAt: now,
        });
        return { token, familyId };
    }

    async rotate(token: string): Promise<RotatedRefreshToken> {
        if (!token) throw this.invalid();

        const current = await this.repo.findByHash(this.hash(token));
        if (!current) throw this.invalid();

        if (current.revokedAt) {
            await this.repo.revokeFamily(current.familyId);
            throw this.invalid();
        }
        if (current.expiresAt.getTime() <= Date.now()) {
            throw this.invalid();
        }

        const won = await this.repo.revoke(current.id);
        if (!won) {
            await this.repo.revokeFamily(current.familyId);
            throw this.invalid();
        }

        const next = await this.issue(current.accountId, current.familyId);
        return { ...next, accountId: current.accountId };
    }

    async revokeFamilyByToken(token: string): Promise<void> {
        if (!token) return;
        const current = await this.repo.findByHash(this.hash(token));
        if (current) await this.repo.revokeFamily(current.familyId);
    }

    async revokeFamily(familyId: string): Promise<void> {
        await this.repo.revokeFamily(familyId);
    }

    private hash(token: string): string {
        return createHash('sha256').update(token).digest('hex');
    }

    private invalid(): ApiException {
        return new ApiException(
            HttpStatus.UNAUTHORIZED,
            ErrorCode.INVALID_REFRESH_TOKEN,
            'Invalid or expired refresh token',
        );
    }
}