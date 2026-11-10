import { UserBase } from "./user.type.js";

export interface Admin extends UserBase {
    isSuperAdmin: boolean;
}