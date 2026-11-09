"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X, Globe, ChevronDown } from "lucide-react";
import type { Locale } from "@/i18n/config";
import "./navigation-bar.css";
import { cn } from "@/libs/utils";

type NavbarProps = {
    lang: Locale;
    t: {
        home: string;
        about: string;
        services: string;
        contact: string;
        language: string;
        login: string;
        register: string;
    };
};

export function NavigationBar({ lang, t }: NavbarProps) {
    const pathname = usePathname();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [languageOpen, setLanguageOpen] = useState(false);

    const navItems = [
        { label: t.home, href: `/${lang}` },
        { label: t.about, href: `/${lang}/about` },
        { label: t.services, href: `/${lang}/services` },
        { label: t.contact, href: `/${lang}/contact` },
    ];

    const switchLanguage = (locale: Locale) => {
        const segments = pathname.split("/");
        segments[1] = locale;
        return segments.join("/") || `/${locale}`;
    };

    const navLinkClass = (active: boolean) =>
        cn("relative rounded-full px-4 py-2 text-sm font-semibold transition-all duration-300", active ? "bg-brand/10 text-brand-text" : "text-fg-2 hover:bg-surface-hover hover:text-fg");

    return (
        <header className="sticky top-4 z-50 mx-auto w-[calc(100%-2rem)] max-w-7xl">
            <nav className="glass-navbar relative flex h-18 items-center justify-between rounded-full px-5 lg:px-8">
                {/* Logo */}
                <Link
                    href={`/${lang}`}
                    className="relative z-10 text-2xl font-extrabold tracking-tight text-fg"
                >
                    Fibera<span className="text-brand">.</span>
                </Link>

                {/* Desktop navigation */}
                <div className="relative z-10 hidden items-center gap-2 md:flex">
                    {navItems.map((item) => {
                        const isActive =
                            item.href === `/${lang}`
                                ? pathname === item.href
                                : pathname.startsWith(item.href);

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={navLinkClass(isActive)}
                            >
                                {item.label}
                            </Link>
                        );
                    })}
                </div>

                {/* Desktop actions */}
                <div className="relative z-10 hidden items-center gap-3 md:flex">
                    {/* Language dropdown */}
                    <div className="relative">
                        <button
                            type="button"
                            onClick={() => setLanguageOpen(!languageOpen)}
                            className="flex items-center gap-2 rounded-full px-3 py-2 text-sm font-semibold text-fg-2 transition hover:bg-surface-hover hover:text-fg"
                            aria-expanded={languageOpen}
                        >
                            <Globe size={17} />
                            {lang.toUpperCase()}
                            <ChevronDown
                                size={14}
                                className={cn("transition-transform", languageOpen && "rotate-180")}
                            />
                        </button>

                        {languageOpen && (
                            <div className="absolute right-0 top-full mt-3 w-36 overflow-hidden rounded-2xl border border-line bg-surface p-1.5 shadow-panel backdrop-blur-2xl">
                                {(["vi", "en"] as Locale[]).map((locale) => (
                                    <Link
                                        key={locale}
                                        href={switchLanguage(locale)}
                                        onClick={() => setLanguageOpen(false)}
                                        className={cn("block rounded-xl px-3 py-2.5 text-sm transition", lang === locale ? "bg-brand/10 font-bold text-brand-text" : "text-fg-2 hover:bg-surface-hover hover:text-fg")}
                                    >
                                        {locale === "vi" ? "Tiếng Việt" : "English"}
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>

                    <Link
                        href={`/${lang}/login`}
                        className="rounded-full border border-line px-5 py-2.5 text-sm font-bold text-fg transition hover:border-brand/50 hover:bg-brand/10"
                    >
                        {t.login}
                    </Link>

                    <Link
                        href={`/${lang}/register`}
                        className="rounded-full bg-brand px-5 py-2.5 text-sm font-bold text-brand-ink shadow-glow transition hover:bg-brand-deep hover:shadow-glow"
                    >
                        {t.register}
                    </Link>
                </div>

                {/* Mobile menu button */}
                <button
                    type="button"
                    onClick={() => setMobileOpen(!mobileOpen)}
                    className="relative z-10 rounded-full p-2.5 text-fg transition hover:bg-surface-hover md:hidden"
                    aria-label={mobileOpen ? "Close menu" : "Open menu"}
                    aria-expanded={mobileOpen}
                >
                    {mobileOpen ? <X size={23} /> : <Menu size={23} />}
                </button>
            </nav>

            {/* Mobile navigation */}
            {mobileOpen && (
                <div className="glass-navbar mt-3 rounded-3xl p-4 md:hidden">
                    <div className="flex flex-col gap-1">
                        {navItems.map((item) => {
                            const active =
                                item.href === `/${lang}`
                                    ? pathname === item.href
                                    : pathname.startsWith(item.href);

                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setMobileOpen(false)}
                                    className={navLinkClass(active)}
                                >
                                    {item.label}
                                </Link>
                            );
                        })}
                    </div>

                    <div className="my-3 border-t border-line" />

                    <div className="flex gap-3">
                        <Link
                            href={`/${lang}/login`}
                            onClick={() => setMobileOpen(false)}
                            className="flex-1 rounded-full border border-line py-2.5 text-center text-sm font-bold text-fg"
                        >
                            {t.login}
                        </Link>

                        <Link
                            href={`/${lang}/register`}
                            onClick={() => setMobileOpen(false)}
                            className="flex-1 rounded-full bg-brand py-2.5 text-center text-sm font-bold text-brand-ink"
                        >
                            {t.register}
                        </Link>
                    </div>
                </div>
            )}
        </header>
    );
}
