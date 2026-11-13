import type { RefreshToken } from './refresh-token.types.js';

export abstract class RefreshTokensRepository {
    abstract create(token: RefreshToken): Promise<RefreshToken>;
    abstract findByHash(tokenHash: string): Promise<RefreshToken | null>;

    /** Returns true only if THIS call revoked the token (it was still active). */
    abstract revoke(id: string): Promise<boolean>;

    abstract revokeFamily(familyId: string): Promise<void>;
}