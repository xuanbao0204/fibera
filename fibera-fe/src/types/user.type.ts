import { BaseEntity } from "./base-entity";

export interface User extends BaseEntity {
    fullName: string;
    phone: string;

    avatarUrl?: string | null;
    gender: "MALE" | "FEMALE" | "OTHER";
    dateOfBirth?: string | null;
}