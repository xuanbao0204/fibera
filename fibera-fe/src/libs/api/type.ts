export type Role = 'tenant' | 'landlord' | 'admin';
export type AccountStatus = 'active' | 'suspended';

export interface ApiErrorDetail {
    field: string;
    reason: string;
}

export interface ApiSuccess<T> {
    success: true;
    message: string;
    data: T;
}

export interface ApiErrorBody {
    success: false;
    message: string;
    error: { code: string; details?: ApiErrorDetail[] };
}

export interface Account {
    id: string;
    email: string;
    role: Role;
    userId: string;
    status: AccountStatus;
    lastLoginAt: string | null;
    createdAt: string;
    updatedAt: string;
}

interface UserBase {
    id: string;
    fullName: string;
    phone: string;
    avatarUrl: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface Tenant extends UserBase {
    occupation: string | null;
    budgetMin: number | null;
    budgetMax: number | null;
}

export interface Landlord extends UserBase {
    address: string | null;
    verified: boolean;
}

export interface Admin extends UserBase {
    isSuperAdmin: boolean;
}

export type Profile = Tenant | Landlord | Admin;

export interface Me {
    account: Account;
    profile: Profile;
}