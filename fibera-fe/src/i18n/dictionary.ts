import "server-only";

import type { Locale } from "./config";
import { defaultLocale, isValidLocale } from "./config";

const dictionaries = {
    vi: () => import("./dicts/vi.json").then((m) => m.default),
    en: () => import("./dicts/en.json").then((m) => m.default),
};

export type Dictionary = Awaited<
    ReturnType<(typeof dictionaries)["vi"]>
>;

export async function getDictionary(lang: string) {
    const locale = isValidLocale(lang) ? lang : defaultLocale;

    return dictionaries[locale]();
}