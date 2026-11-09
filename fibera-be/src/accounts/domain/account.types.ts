import { Role } from "../../common/constants/role.enum.js";
import { AccountStatus } from "./account-status.enum.js";

export interface Account<R extends Role = Role> {
    id: string;
    email: string;
    passwordHash: string;
    role: R;
    userId: string;
    status: AccountStatus;
    lastLoginAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
}

export type PublicAccount<R extends Role = Role> = Omit<
    Account<R>,
    'passwordHash'
>;