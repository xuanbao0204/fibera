import { BaseEntity } from "../base-entity";
import { VerificationStatus } from "./type";

export interface RoomVerification extends BaseEntity {
    roomId: string;
    adminId: string;

    result: VerificationStatus;
    note?: string | null;

    checkedAt: string;
}