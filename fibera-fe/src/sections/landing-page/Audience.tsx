import { ButtonLink } from "@/components/ui/ButtonLink";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { Locale } from "@/i18n/config";
import type { AudienceMessages } from "@/i18n/dictionary.type";

type Panel = AudienceMessages["tenant"];

function AudiencePanel({ panel, href, featured }: { panel: Panel; href: string; featured?: boolean }) {
  return (
    <div className={`glass flex h-full flex-col p-8 sm:p-10 ${featured ? "border-brand/40 shadow-glow" : ""}`}>
      <span className="inline-flex w-fit items-center gap-2 rounded-full bg-brand/10 px-3.5 py-1 text-xs font-semibold text-brand-text">
        {panel.badge}
      </span>
      <h3 className="mt-5 text-2xl font-semibold tracking-tight sm:text-3xl">{panel.title}</h3>
      <p className="mt-2 text-fg-2">{panel.description}</p>

      <ul className="mt-6 flex-1 space-y-3">
        {panel.points.map((point) => (
          <li key={point} className="flex items-start gap-3 text-sm text-fg-2">
            <Icon name="check" className="mt-0.5 size-5 shrink-0 text-brand-text" />
            <span>{point}</span>
          </li>
        ))}
      </ul>

      <ButtonLink href={href} variant={featured ? "primary" : "outline"} className="mt-8 w-full sm:w-fit">
        {panel.cta} <Icon name="arrow" className="size-4" />
      </ButtonLink>
    </div>
  );
}

export function Audience({ t, lang }: { t: AudienceMessages; lang: Locale }) {
  return (
    <section id="audience" className="scroll-mt-24 px-6 py-24">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <SectionHeading eyebrow={t.eyebrow} title={t.title} desc={t.description} />
        </Reveal>

        <div className="mt-14 grid grid-cols-1 gap-5 lg:grid-cols-2">
          <Reveal className="h-full">
            <AudiencePanel panel={t.tenant} href={`/${lang}#top`} />
          </Reveal>
          <Reveal className="h-full" delay={120}>
            <AudiencePanel panel={t.landlord} href={`/${lang}/register`} featured />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
