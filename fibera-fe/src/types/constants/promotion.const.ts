import { CalendarCheck, CalendarRange, GraduationCap, Sparkles, type LucideIcon } from 'lucide-react';

import type { Promotion } from '@/types/room/promotion.type';
import { PromotionBenefit, PromotionCode } from '../enums/promotion.type';

// Nhãn nằm ở dictionary: enums.promotionCode[code].
export const PROMOTION_CONFIG: Record<PromotionCode, { icon: LucideIcon }> = {
    STUDENT: { icon: GraduationCap },
    FIRST_MONTH: { icon: CalendarCheck },
    LONG_TERM: { icon: CalendarRange },
    NEW_TENANT: { icon: Sparkles },
};

const DEFAULT_LEASE_MONTHS = 12;

export function isPromotionActive(promotion: Promotion, now: Date = new Date()): boolean {
    return (
        promotion.isActive &&
        new Date(promotion.startsAt) <= now &&
        (promotion.endsAt === null || new Date(promotion.endsAt) >= now)
    );
}

/** Số tiền tiết kiệm ước tính, dùng để chọn ưu đãi nổi bật nhất. */
export function estimateSaving(
    rent: number,
    benefit: PromotionBenefit,
    leaseMonths: number = DEFAULT_LEASE_MONTHS,
): number {
    switch (benefit.kind) {
        case 'PERCENT_OFF':
            return ((rent * benefit.percent) / 100) * (benefit.months ?? leaseMonths);
        case 'AMOUNT_OFF':
            return benefit.amount * (benefit.months ?? leaseMonths);
        case 'FREE_MONTHS':
            return rent * benefit.months;
        case 'DEPOSIT_OFF':
            return 0; // tính theo tiền cọc, không thuộc tiền thuê
    }
}

export function pickHeadlinePromotion(
    promotions: readonly Promotion[],
    rent: number,
): Promotion | undefined {
    return [...promotions].sort(
        (a, b) => estimateSaving(rent, b.benefit) - estimateSaving(rent, a.benefit),
    )[0];
}