export const PRICE_PERIODS = ['MONTH', 'DAY'] as const;
export type PricePeriod = (typeof PRICE_PERIODS)[number];