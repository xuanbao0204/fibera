import { Role } from "../../common/constants/role.enum.js";
import { Admin } from "./admin.type.js";
import { Landlord } from "./landlord.type.js";
import { Tenant } from "./tenant.type.js";

export interface UserBase {
    id: string;
    fullName: string;
    phone: string;
    avatarUrl: string | null;
    createdAt: Date;
    updatedAt: Date;
}

export interface UserByRole {
    [Role.TENANT]: Tenant;
    [Role.LANDLORD]: Landlord;
    [Role.ADMIN]: Admin;
}

export type UserOf<R extends Role> = UserByRole[R];

export type User = UserOf<Role>;