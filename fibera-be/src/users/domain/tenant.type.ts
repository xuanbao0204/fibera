import { UserBase } from "./user.type.js";

export interface Tenant extends UserBase {
  occupation: string | null;
  budgetMin: number | null;
  budgetMax: number | null;
}