import { cn } from "./utils";

export const fieldClass =
  "w-full rounded-panel border border-line bg-surface px-4 py-3 text-sm text-fg outline-none transition placeholder:text-fg-muted focus:border-brand";

export const linkClass =
  cn("relative font-semibold text-brand",
    "after:absolute after:bottom-0 after:left-0",
    " after:h-px after:w-0 after:bg-brand",
    "after:transition-[width] after:duration-300 after:ease-in-out",
    "hover:after:w-full");

export const ctaClass = "font-bold text-brand-ink hover:bg-brand-deep transition-all duration-300"