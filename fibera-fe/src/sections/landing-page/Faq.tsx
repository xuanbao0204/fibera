import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { FaqMessages } from "@/i18n/dictionary.type";

export function Faq({ t }: { t: FaqMessages }) {
  return (
    <section id="faq" className="scroll-mt-24 px-6 py-24">
      <div className="mx-auto max-w-3xl">
        <Reveal>
          <SectionHeading eyebrow={t.eyebrow} title={t.title} desc={t.description} />
        </Reveal>

        <div className="mt-12 space-y-3">
          {t.items.map((item, i) => (
            <Reveal key={item.question} delay={i * 60}>
              <details className="group glass px-6 py-5 open:bg-surface-hover">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-left font-semibold">
                  {item.question}
                  <Icon name="chevron" className="size-5 shrink-0 text-fg-2 transition-transform group-open:rotate-180" />
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-fg-2">{item.answer}</p>
              </details>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
