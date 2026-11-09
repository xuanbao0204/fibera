export const locales = ["vi", "en"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "vi";

export const localeNames: Record<Locale, string> = {
    vi: "Tiếng Việt",
    en: "English",
};

export function isValidLocale(
    value: string
): value is Locale {
    return locales.includes(value as Locale);
}