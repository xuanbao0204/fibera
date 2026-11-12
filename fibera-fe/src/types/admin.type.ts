import type { User } from './user.type.js';

export interface Admin extends User {
    isSuperAdmin: boolean;
}