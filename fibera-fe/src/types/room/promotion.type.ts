import { BaseEntity } from "../base-entity";
import { PromotionBenefit, PromotionCode } from "../enums/promotion.type";

export interface PromotionConditions {
    minLeaseMonths?: number;
    requiresStudentProof?: boolean;
}

export interface Promotion extends BaseEntity {
    roomId: string;
    code: PromotionCode;          // loại chương trình: quyết định nhãn và icon
    benefit: PromotionBenefit;    // cách tính: quyết định số tiền
    conditions: PromotionConditions;
    startsAt: string;
    endsAt: string | null;
    isActive: boolean;            // chủ trọ tạm dừng thủ công
}