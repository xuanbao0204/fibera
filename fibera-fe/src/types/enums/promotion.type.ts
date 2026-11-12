export const PROMOTION_CODES = [
    'STUDENT',
    'FIRST_MONTH',
    'LONG_TERM',
    'NEW_TENANT',
] as const;

export type PromotionCode = (typeof PROMOTION_CODES)[number];

const PROMOTION_CODE_SET: ReadonlySet<string> = new Set(PROMOTION_CODES);

export const isPromotionCode = (value: string): value is PromotionCode =>
    PROMOTION_CODE_SET.has(value);

// Cách tính. months bỏ trống = áp dụng suốt thời gian thuê.
export type PromotionBenefit =
    | { kind: 'PERCENT_OFF'; percent: number; months?: number }
    | { kind: 'AMOUNT_OFF'; amount: number; months?: number }
    | { kind: 'FREE_MONTHS'; months: number }
    | { kind: 'DEPOSIT_OFF'; percent: number };