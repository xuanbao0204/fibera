"use client";

import { Icon } from "@/components/ui/Icon";
import { cn } from "@/libs/utils";
import { THEME_STORAGE_KEY } from "@/libs/theme";

export function ThemeToggle({ label, className }: { label: string; className?: string }) {
    const toggle = () => {
        const root = document.documentElement;
        const next = root.dataset.theme === "light" ? "dark" : "light";
        root.dataset.theme = next;
        try {
            localStorage.setItem(THEME_STORAGE_KEY, next);
        } catch { }
    };

    return (
        <button
            type="button"
            onClick={toggle}
            aria-label={label}
            title={label}
            className={cn(
                "grid size-10 place-items-center rounded-full text-fg-2 transition hover:bg-surface-hover hover:text-fg",
                className,
            )}
        >
            <Icon name="sun" className="hidden size-4.5 dark:block" />
            <Icon name="moon" className="size-4.5 dark:hidden" />
        </button>
    );
}
