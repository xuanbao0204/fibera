import { RentalPreference } from "./rental-preference.type";
import { User } from "./user.type";

export interface Tenant extends User {
    school?: string | null;
    preference?: RentalPreference | null;
}