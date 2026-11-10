import { Icon, type IconName } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { HowItWorksMessages } from "@/i18n/dictionary.type";

const icons: IconName[] = ["search", "chat", "key"];

export function HowItWorks({ t }: { t: HowItWorksMessages }) {
  return (
    <section id="about" className="scroll-mt-24 px-6 py-24">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <SectionHeading eyebrow={t.eyebrow} title={t.title} desc={t.description} />
        </Reveal>

        <ol className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-3">
          {t.steps.map((step, i) => (
            <Reveal key={step.title} delay={i * 100} className="h-full">
              <li className="glass relative h-full overflow-hidden p-7">
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute -right-2 -top-4 select-none font-mono text-8xl font-bold text-brand/10"
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="relative grid size-12 place-items-center rounded-2xl bg-brand text-brand-ink shadow-glow">
                  <Icon name={icons[i] ?? "check"} className="size-6" />
                </span>
                <h3 className="relative mt-5 text-xl font-semibold tracking-tight">{step.title}</h3>
                <p className="relative mt-2 text-sm leading-relaxed text-fg-2">{step.description}</p>
              </li>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
