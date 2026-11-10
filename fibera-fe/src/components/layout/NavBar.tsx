"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X, Globe } from "lucide-react";
import { localeNames, locales, type Locale } from "@/i18n/config";
import type { NavbarMessages } from "@/i18n/dictionary.type";
import "./navigation-bar.css";
import { cn } from "@/libs/utils";
import { Logo } from "@/components/ui/Logo";
import { ThemeToggle } from "./ThemeToggle";
import { Dropdown } from "../ui/DropDown";

type NavbarProps = {
    lang: Locale;
    t: NavbarMessages;
};

const SPY_IDS = ["features", "about", "contact"] as const;

export function NavigationBar({ lang, t }: NavbarProps) {
    const pathname = usePathname();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [active, setActive] = useState("home");

    const onLanding = pathname === `/${lang}`;

    const navItems = [
        { id: "home", label: t.home, href: `/${lang}` },
        { id: "features", label: t.features, href: `/${lang}#features` },
        { id: "about", label: t.about, href: `/${lang}#about` },
        { id: "faq", label: t.faq, href: `/${lang}#faq` },
        { id: "contact", label: t.contact, href: `/${lang}#contact` },
    ];

    useEffect(() => {
        if (!onLanding) return;
        let raf = 0;
        const update = () => {
            raf = 0;
            const line = window.innerHeight * 0.35;
            let current = "home";
            for (const id of SPY_IDS) {
                const el = document.getElementById(id);
                if (el && el.getBoundingClientRect().top <= line) current = id;
            }
            setActive(current);
        };
        const onScroll = () => {
            if (!raf) raf = requestAnimationFrame(update);
        };
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        window.addEventListener("resize", onScroll);
        return () => {
            if (raf) cancelAnimationFrame(raf);
            window.removeEventListener("scroll", onScroll);
            window.removeEventListener("resize", onScroll);
        };
    }, [onLanding]);

    const switchLanguage = (locale: Locale) => {
        const segments = pathname.split("/");
        segments[1] = locale;
        return segments.join("/") || `/${locale}`;
    };

    const isActive = (id: string) => onLanding && active === id;

    const navLinkClass = (activeItem: boolean) =>
        cn("relative rounded-full px-4 py-2 text-sm font-semibold transition-all duration-300", activeItem ? "bg-brand/10 text-brand-text" : "text-fg-2 hover:bg-surface-hover hover:text-fg");

    return (
        <header className="sticky top-4 z-50 mx-auto w-[calc(100%-2rem)] max-w-7xl">
            <nav className="glass-navbar relative flex h-18 items-center justify-between rounded-full px-5 lg:px-8" aria-label="Main">
                <Link href={`/${lang}`} className="relative z-10" aria-label="Fibera">
                    <Logo />
                </Link>

                <div className="relative z-10 hidden items-center gap-2 md:flex">
                    {navItems.map((item) => (
                        <Link
                            key={item.id}
                            href={item.href}
                            aria-current={isActive(item.id) ? "true" : undefined}
                            className={navLinkClass(isActive(item.id))}
                        >
                            {item.label}
                        </Link>
                    ))}
                </div>

                <div className="relative z-10 hidden items-center gap-2 md:flex">
                    <ThemeToggle label={t.toggleTheme} />

                    <Dropdown>
                        <Dropdown.Trigger
                            aria-label={t.language}
                            className="w-auto rounded-full border-transparent bg-transparent px-1 py-2 hover:border-transparent"
                        >
                            <Globe size={17} />

                            {lang.toUpperCase()}
                        </Dropdown.Trigger>

                        <Dropdown.Content className="right-0 left-auto w-36">
                            {locales.map((locale) => (
                                <Dropdown.MenuItem
                                    key={locale}
                                    href={switchLanguage(locale)}
                                    active={lang === locale}
                                >
                                    {localeNames[locale]}
                                </Dropdown.MenuItem>
                            ))}
                        </Dropdown.Content>
                    </Dropdown>


                    <Link
                        href={`/${lang}/login`}
                        className="rounded-full border border-line px-5 py-2.5 text-sm font-bold text-fg transition hover:border-brand/50 hover:bg-brand/10"
                    >
                        {t.login}
                    </Link>

                    <Link
                        href={`/${lang}/register`}
                        className="rounded-full bg-brand px-5 py-2.5 text-sm font-bold text-brand-ink shadow-glow transition hover:bg-brand-deep"
                    >
                        {t.register}
                    </Link>
                </div>

                <div className="relative z-10 flex items-center gap-1 md:hidden">
                    <ThemeToggle label={t.toggleTheme} />
                    <button
                        type="button"
                        onClick={() => setMobileOpen(!mobileOpen)}
                        className="rounded-full p-2.5 text-fg transition hover:bg-surface-hover"
                        aria-label={mobileOpen ? t.closeMenu : t.openMenu}
                        aria-expanded={mobileOpen}
                    >
                        {mobileOpen ? <X size={23} /> : <Menu size={23} />}
                    </button>
                </div>
            </nav>

            {mobileOpen && (
                <div className="glass-navbar mt-3 rounded-xl p-4 md:hidden">
                    <div className="flex flex-col gap-1">
                        {navItems.map((item) => (
                            <Link
                                key={item.id}
                                href={item.href}
                                onClick={() => setMobileOpen(false)}
                                aria-current={isActive(item.id) ? "true" : undefined}
                                className={navLinkClass(isActive(item.id))}
                            >
                                {item.label}
                            </Link>
                        ))}
                    </div>

                    <div className="my-3 border-t border-line" />

                    <div className="mb-3 flex items-center gap-2">
                        <Globe size={16} className="text-fg-muted" aria-hidden="true" />
                        {locales.map((locale) => (
                            <Link
                                key={locale}
                                href={switchLanguage(locale)}
                                onClick={() => setMobileOpen(false)}
                                className={cn("rounded-full px-3 py-1.5 text-xs font-semibold transition", lang === locale ? "bg-brand/10 text-brand-text" : "text-fg-2 hover:bg-surface-hover")}
                            >
                                {localeNames[locale]}
                            </Link>
                        ))}
                    </div>

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
