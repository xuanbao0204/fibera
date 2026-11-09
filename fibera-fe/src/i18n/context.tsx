"use client";

import { createContext, useContext, type ReactNode, } from "react";

import type { Locale } from "./config";
import type { Dictionary } from "./dictionary";

interface I18nContextValue { locale: Locale; dictionary: Dictionary; }

const I18nContext = createContext<I18nContextValue | null>(null);

interface I18nProviderProps {
    locale: Locale;
    dictionary: Dictionary;
    children: ReactNode;
}

export function I18nProvider({
    locale,
    dictionary,
    children,
}: I18nProviderProps) {
    return (
        <I18nContext.Provider value={{ locale, dictionary }}>
            {children}
        </I18nContext.Provider>
    );
}

export function useTranslation() {
    const context = useContext(I18nContext);

    if (!context) {
        throw new Error(
            "useTranslation must be used within I18nProvider"
        );
    }

    return {
        locale: context.locale,
        t: context.dictionary,
    };;
}