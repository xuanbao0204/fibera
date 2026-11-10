import { UserBase } from "./user.type.js";

export interface Landlord extends UserBase {
    address: string | null;
    verified: boolean;
}