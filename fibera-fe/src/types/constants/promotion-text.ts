// constants/promotion-text.ts
// Dựng câu mô tả ưu đãi theo ngôn ngữ từ dữ liệu có cấu trúc + dictionary.
import type { Locale } from '@/i18n/config';
import type { RoomDetailMessage } from '@/i18n/dictionary.type';
import type { Promotion } from '@/types/room/promotion.type';
import { PromotionBenefit } from '../enums/promotion.type';
import { formatMessage, plural } from '@/i18n/format';
import { formatCompactPrice, formatDate } from '@/features/rooms/constants/room-feed.constant';

type PromotionMessage = RoomDetailMessage['promotion'];

export function describeBenefit(
    benefit: PromotionBenefit,
    t: PromotionMessage,
    lang: Locale,
): string {
    const withMonths = (text: string, months?: number) =>
        months === undefined
            ? text
            : `${text} ${plural(lang, t.benefit.forMonths, months)}`;

    switch (benefit.kind) {
        case 'PERCENT_OFF':
            return withMonths(
                formatMessage(t.benefit.PERCENT_OFF, { percent: benefit.percent }),
                benefit.months,
            );
        case 'AMOUNT_OFF':
            return withMonths(
                formatMessage(t.benefit.AMOUNT_OFF, {
                    amount: formatCompactPrice(benefit.amount, lang),
                }),
                benefit.months,
            );
        case 'FREE_MONTHS':
            return plural(lang, t.benefit.FREE_MONTHS, benefit.months);
        case 'DEPOSIT_OFF':
            return formatMessage(t.benefit.DEPOSIT_OFF, { percent: benefit.percent });
    }
}

export function describeConditions(
    promotion: Promotion,
    t: PromotionMessage,
    lang: Locale,
): string[] {
    const { minLeaseMonths, requiresStudentProof } = promotion.conditions;
    const result: string[] = [];

    if (minLeaseMonths) {
        result.push(plural(lang, t.condition.minLeaseMonths, minLeaseMonths));
    }

    if (requiresStudentProof) {
        result.push(t.condition.studentProof);
    }

    return result;
}

export function describeValidity(
    promotion: Promotion,
    t: PromotionMessage,
    lang: Locale,
): string {
    return promotion.endsAt
        ? formatMessage(t.condition.validUntil, {
            date: formatDate(promotion.endsAt, lang),
        })
        : t.condition.noExpiry;
}