import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import type { Locale } from "@/i18n/config";
import type { FooterMessages, NavbarMessages } from "@/i18n/dictionary.type";

type FooterProps = { lang: Locale; t: FooterMessages; nav: NavbarMessages };

const linkClass = "text-sm text-fg-2 transition hover:text-brand-text";

export function Footer({ lang, t, nav }: FooterProps) {
  const explore = [
    { label: nav.about, href: `/${lang}#about` },
    { label: t.faqLabel, href: `/${lang}#faq` },
    { label: nav.contact, href: `/${lang}#contact` },
  ];
  const account = [
    { label: nav.login, href: `/${lang}/login` },
    { label: nav.register, href: `/${lang}/register` },
  ];

  return (
    <footer className="mt-auto border-t border-line px-6 pb-8 pt-14">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr]">
          <div className="max-w-sm">
            <Link href={`/${lang}`} aria-label="Fibera"><Logo /></Link>
            <p className="mt-4 text-sm text-fg-2">{t.tagline}</p>
          </div>

          <nav aria-label={t.exploreTitle}>
            <p className="micro">{t.exploreTitle}</p>
            <ul className="mt-4 space-y-3">
              {explore.map((l) => (
                <li key={l.href}><Link href={l.href} className={linkClass}>{l.label}</Link></li>
              ))}
            </ul>
          </nav>

          <nav aria-label={t.accountTitle}>
            <p className="micro">{t.accountTitle}</p>
            <ul className="mt-4 space-y-3">
              {account.map((l) => (
                <li key={l.href}><Link href={l.href} className={linkClass}>{l.label}</Link></li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-12 border-t border-line pt-6 text-xs text-fg-muted">
          <Year /> Fibera. {t.rights}
        </div>
      </div>
    </footer>
  );
}


async function Year() {
  "use cache";
  return new Date().getFullYear();
}