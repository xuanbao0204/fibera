import { BaseEntity } from "./base-entity";
import { AccountStatus } from "./enums/account-status.type";
import { Role } from "./enums/role.type";

export interface Account extends BaseEntity {
    email: string;
    phone?: string;

    passwordHash: string;

    roles: Role;
    status: AccountStatus;

    userId: string;

    lastLoginAt?: string | null;
}