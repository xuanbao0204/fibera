import { Icon, type IconName } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { FeaturesMessages } from "@/i18n/dictionary.type";

const icons: IconName[] = ["shield", "coins", "sparkles", "pin", "calendar", "chat"];

export function Features({ t }: { t: FeaturesMessages }) {
  return (
    <section id="features" className="scroll-mt-24 px-6 py-24">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <SectionHeading eyebrow={t.eyebrow} title={t.title} desc={t.description} />
        </Reveal>

        <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {t.items.map((item, i) => (
            <Reveal key={item.title} delay={(i % 3) * 80} className="h-full">
              <article className="glass glass-hover h-full p-7">
                <span className="grid size-12 place-items-center rounded-2xl bg-brand/10 text-brand-text">
                  <Icon name={icons[i] ?? "check"} className="size-6" />
                </span>
                <h3 className="mt-5 text-xl font-semibold tracking-tight">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-fg-2">{item.description}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
