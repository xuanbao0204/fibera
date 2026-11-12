import type { RoomPrice } from '@/types/room';
import type { Promotion } from '@/types/room/promotion.type';

export interface PaymentContext {
    leaseMonths: number;
    isStudent: boolean;
}

export type MissingCondition = 'MIN_LEASE' | 'STUDENT_PROOF';

export interface SkippedPromotion {
    promotion: Promotion;
    missing: MissingCondition[];
}

export interface PaymentEstimate {
    applied: Promotion[];
    skipped: SkippedPromotion[];
    rent: number;
    firstMonthRent: number;
    depositOriginal: number;
    deposit: number;
    moveInTotalOriginal: number;
    moveInTotal: number;
    /** Tháng bắt đầu đổi giá (khi có ưu đãi giới hạn số tháng), null nếu không đổi. */
    ongoingFromMonth: number | null;
    ongoingRent: number;
    /** Tiết kiệm tiền thuê trong cả thời gian thuê (chưa tính giảm tiền cọc). */
    leaseSavings: number;
}

export function getMissingConditions(
    promotion: Promotion,
    context: PaymentContext,
): MissingCondition[] {
    const missing: MissingCondition[] = [];
    const { minLeaseMonths, requiresStudentProof } = promotion.conditions;

    if (minLeaseMonths && context.leaseMonths < minLeaseMonths) {
        missing.push('MIN_LEASE');
    }

    if (requiresStudentProof && !context.isStudent) {
        missing.push('STUDENT_PROOF');
    }

    return missing;
}

const appliesToMonth = (months: number | undefined, month: number) =>
    months === undefined || month <= months;

/**
 * Quy tắc cộng dồn (đơn giản và dễ dự đoán):
 * - Miễn phí tháng: tiền thuê tháng đó = 0.
 * - Giảm %: cộng các % lại (không nhân dồn), tối đa 100%.
 * - Giảm tiền: trừ sau khi đã giảm %, tiền thuê không âm.
 */
function rentForMonth(rent: number, month: number, applied: Promotion[]): number {
    let percent = 0;
    let amount = 0;

    for (const { benefit } of applied) {
        switch (benefit.kind) {
            case 'FREE_MONTHS':
                if (month <= benefit.months) return 0;
                break;
            case 'PERCENT_OFF':
                if (appliesToMonth(benefit.months, month)) percent += benefit.percent;
                break;
            case 'AMOUNT_OFF':
                if (appliesToMonth(benefit.months, month)) amount += benefit.amount;
                break;
            case 'DEPOSIT_OFF':
                break;
        }
    }

    const afterPercent = rent * (1 - Math.min(percent, 100) / 100);

    return Math.max(0, Math.round(afterPercent - amount));
}

export function calculatePayment(
    price: Pick<RoomPrice, 'rent' | 'deposit'>,
    promotions: readonly Promotion[],
    context: PaymentContext,
): PaymentEstimate {
    const applied: Promotion[] = [];
    const skipped: SkippedPromotion[] = [];

    for (const promotion of promotions) {
        const missing = getMissingConditions(promotion, context);

        if (missing.length === 0) applied.push(promotion);
        else skipped.push({ promotion, missing });
    }

    const { rent, deposit: depositOriginal } = price;

    const depositPercent = Math.min(
        applied.reduce(
            (sum, { benefit }) =>
                benefit.kind === 'DEPOSIT_OFF' ? sum + benefit.percent : sum,
            0,
        ),
        100,
    );
    const deposit = Math.round(depositOriginal * (1 - depositPercent / 100));

    const firstMonthRent = rentForMonth(rent, 1, applied);

    const limitedMonths = applied.flatMap(({ benefit }) =>
        benefit.kind !== 'DEPOSIT_OFF' && benefit.months !== undefined
            ? [benefit.months]
            : [],
    );
    const limitedMax = limitedMonths.length > 0 ? Math.max(...limitedMonths) : 0;
    const ongoingFromMonth =
        limitedMax > 0 && limitedMax < context.leaseMonths ? limitedMax + 1 : null;
    const ongoingRent =
        ongoingFromMonth === null
            ? firstMonthRent
            : rentForMonth(rent, ongoingFromMonth, applied);

    let leaseRent = 0;
    for (let month = 1; month <= context.leaseMonths; month += 1) {
        leaseRent += rentForMonth(rent, month, applied);
    }

    return {
        applied,
        skipped,
        rent,
        firstMonthRent,
        depositOriginal,
        deposit,
        moveInTotalOriginal: rent + depositOriginal,
        moveInTotal: firstMonthRent + deposit,
        ongoingFromMonth,
        ongoingRent,
        leaseSavings: rent * context.leaseMonths - leaseRent,
    };
}