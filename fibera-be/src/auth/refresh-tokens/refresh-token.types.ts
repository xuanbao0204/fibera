export interface RefreshToken {
    id: string;
    accountId: string;
    familyId: string;
    tokenHash: string;
    expiresAt: Date;
    revokedAt: Date | null;
    createdAt: Date;
}