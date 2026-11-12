import type { User } from './user.type.js';

export interface Landlord extends User {
    displayName?: string | null;

    identityVerified: boolean;
    verifiedAt?: string | null;
}