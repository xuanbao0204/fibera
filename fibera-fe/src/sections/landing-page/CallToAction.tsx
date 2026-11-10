import { ButtonLink } from "@/components/ui/ButtonLink";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import type { Locale } from "@/i18n/config";
import type { CtaMessages } from "@/i18n/dictionary.type";

export function CallToAction({ t, lang }: { t: CtaMessages; lang: Locale }) {
  return (
    <section className="px-6 py-24">
      <Reveal>
        <div className="glass relative mx-auto max-w-5xl overflow-hidden px-6 py-14 text-center shadow-panel sm:px-12 sm:py-20">
          <div aria-hidden="true" className="animate-breathe pointer-events-none absolute -top-24 left-1/2 size-72 -translate-x-1/2 rounded-full bg-brand/20 blur-3xl" />
          <h2 className="relative mx-auto max-w-2xl text-balance text-3xl font-medium leading-[1.1] tracking-[-0.03em] sm:text-4xl md:text-5xl">
            {t.title}
          </h2>
          <p className="relative mx-auto mt-4 max-w-xl text-fg-2">{t.description}</p>
          <div className="relative mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <ButtonLink href={`/${lang}/register`} className="w-full sm:w-auto">
              {t.primary} <Icon name="arrow" className="size-4" />
            </ButtonLink>
            <ButtonLink href={`/${lang}#top`} variant="outline" className="w-full sm:w-auto">
              {t.secondary}
            </ButtonLink>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
