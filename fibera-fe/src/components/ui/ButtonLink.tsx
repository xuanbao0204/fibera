import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/libs/utils";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-bold transition";

const variants = {
  primary: "bg-brand text-brand-ink shadow-glow hover:bg-brand-deep",
  outline: "border border-line text-fg hover:border-brand/50 hover:bg-brand/10",
} as const;

type Props = {
  href: string;
  variant?: keyof typeof variants;
  className?: string;
  children: ReactNode;
};

export function ButtonLink({ href, variant = "primary", className, children }: Props) {
  return (
    <Link href={href} className={cn(base, variants[variant], className)}>
      {children}
    </Link>
  );
}
