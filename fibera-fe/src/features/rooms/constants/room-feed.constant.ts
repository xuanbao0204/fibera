import type { Locale } from '@/i18n/config';
import { ROOM_LAYOUTS } from '@/types/enums/room-layout.type';
import { ROOM_TYPES } from '@/types/enums/room.type';

export const ROOM_FEED_PAGE_SIZE = 6;

export const PRICE_RANGE = { min: 1_000_000, max: 15_000_000 } as const;
export const AREA_RANGE = { min: 20, max: 100 } as const;

// Giữ tên cũ để không phải sửa chỗ đang dùng; nguồn dữ liệu là types/enums.
export const ROOM_TYPE_VALUES = ROOM_TYPES;
export const ROOM_LAYOUT_VALUES = ROOM_LAYOUTS;

export const SORT_VALUES = [
    'recommended',
    'newest',
    'price-asc',
    'price-desc',
    'area-desc',
] as const;

export type RoomFeedSort = (typeof SORT_VALUES)[number];

/* ---------- Format theo ngôn ngữ ---------- */

// Record<Locale, ...> => thêm locale mới mà quên map sẽ báo lỗi biên dịch.
const INTL_LOCALES: Record<Locale, string> = {
    vi: 'vi-VN',
    en: 'en-US',
};

/** Giá là dữ liệu của sản phẩm (VND), không đổi theo ngôn ngữ giao diện. */
export const DEFAULT_CURRENCY = 'VND';

const NBSP = '\u00A0';

const formatterCache = new Map<string, Intl.NumberFormat>();

function getFormatter(lang: Locale, options: Intl.NumberFormatOptions) {
    const key = `${lang}:${JSON.stringify(options)}`;
    let formatter = formatterCache.get(key);

    if (!formatter) {
        formatter = new Intl.NumberFormat(INTL_LOCALES[lang], options);
        formatterCache.set(key, formatter);
    }

    return formatter;
}

function getCurrencySymbol(lang: Locale, currency: string): string {
    return (
        getFormatter(lang, {
            style: 'currency',
            currency,
            currencyDisplay: 'narrowSymbol',
        })
            .formatToParts(0)
            .find((part) => part.type === 'currency')?.value ?? currency
    );
}

/** Số theo locale: vi "1.500.000" | en "1,500,000". */
export function formatNumber(
    value: number,
    lang: Locale,
    options?: Intl.NumberFormatOptions,
): string {
    return getFormatter(lang, options ?? {}).format(value);
}

/**
 * Giá đầy đủ, ký hiệu luôn đứng sau số ở mọi ngôn ngữ để giao diện nhất quán.
 * vi: "1.500.000 ₫"  |  en: "1,500,000 ₫"
 */
export function formatPrice(
    value: number,
    lang: Locale,
    currency: string = DEFAULT_CURRENCY,
): string {
    const amount = formatNumber(value, lang, { maximumFractionDigits: 0 });

    return `${amount}${NBSP}${getCurrencySymbol(lang, currency)}`;
}

/**
 * Giá rút gọn cho card/bộ lọc, đơn vị do Intl tự dịch (không hard-code).
 * vi: "1,5 triệu"  |  en: "1.5 million"
 * Giữ tối đa 2 số lẻ để không làm tròn sai giá (2.350.000 => "2,35 triệu").
 */
export function formatCompactPrice(value: number, lang: Locale): string {
    return formatNumber(value, lang, {
        notation: 'compact',
        compactDisplay: 'long',
        maximumFractionDigits: 2,
    });
}

/** vi: "25,5 m²"  |  en: "25.5 m²" */
export function formatArea(value: number, lang: Locale): string {
    return `${formatNumber(value, lang, { maximumFractionDigits: 1 })}${NBSP}m²`;
}

const dateFormatterCache = new Map<Locale, Intl.DateTimeFormat>();

/** vi: "11/12/2026" | en: "12/11/2026"; cố định múi giờ VN để server và client render giống nhau. */
export function formatDate(value: string | Date, lang: Locale): string {
    let formatter = dateFormatterCache.get(lang);

    if (!formatter) {
        formatter = new Intl.DateTimeFormat(INTL_LOCALES[lang], {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            timeZone: 'Asia/Ho_Chi_Minh',
        });
        dateFormatterCache.set(lang, formatter);
    }

    return formatter.format(new Date(value));
}