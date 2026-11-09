"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

import {
    locales,
    localeNames,
    type Locale,
} from "@/i18n/config";

import { useTranslation } from "@/i18n/use-translation";

export default function LanguageSwitcher() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const { locale } = useTranslation();

    function changeLanguage(nextLocale: Locale) {
        if (nextLocale === locale) return;

        const segments = pathname.split("/");

        segments[1] = nextLocale;

        const newPath = segments.join("/");
        const query = searchParams.toString();

        router.push(query ? `${newPath}?${query}` : newPath);
    }

    return (
        <select
            value={locale}
            onChange={(e) =>
                changeLanguage(e.target.value as Locale)
            }
            aria-label="Select language"
        >
            {locales.map((lang) => (
                <option key={lang} value={lang}>
                    {localeNames[lang]}
                </option>
            ))}
        </select>
    );
}