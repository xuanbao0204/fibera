import { CountUp } from "@/components/ui/CountUp";
import { Icon, type IconName } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { LandingStats } from "@/i18n/dictionary.type";

export function Analysis({ t }: { t: LandingStats }) {
  const stats: { v: string; l: string; icon: IconName }[] = [
    { v: t.verifiedRooms, l: t.verifiedRoomsLabel, icon: "shield" },
    { v: t.happyTenants, l: t.happyTenantsLabel, icon: "users" },
    { v: t.savingFee, l: t.savingFeeLabel, icon: "coins" },
    { v: t.aiMatch, l: t.aiMatchLabel, icon: "sparkles" },
  ];

  const areaPrices = t.chart.areas;
  const max = Math.max(...areaPrices.map((a) => a.value));

  return (
    <section id="analysis" className="scroll-mt-24 px-6 py-24">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <SectionHeading
            eyebrow={t.eyebrow}
            title={t.title}
            desc={t.description}
          />
        </Reveal>

        <div className="mt-14 grid grid-cols-1 gap-5 lg:grid-cols-12">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:col-span-7">
            {stats.map((x, i) => (
              <Reveal key={x.l} delay={i * 80} className="h-full">
                <div className="glass glass-hover h-full p-7">
                  <span className="grid size-10 place-items-center rounded-xl bg-brand/10 text-brand-text">
                    <Icon name={x.icon} />
                  </span>
                  <p className="mt-5 font-mono text-4xl font-bold tracking-tight text-brand-text sm:text-5xl">
                    <CountUp value={x.v} />
                  </p>
                  <p className="mt-3 text-sm text-fg-2">{x.l}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal className="h-full lg:col-span-5" delay={200}>
            <div className="glass h-full p-7">
              <p className="micro">
                {t.chart.title} · {t.chart.unit}
              </p>

              <div className="mt-8 flex h-56 items-end gap-2.5">
                {areaPrices.map((a, i) => {
                  const peak = a.value === max;

                  return (
                    <div
                      key={a.label}
                      className="flex h-full flex-1 flex-col justify-end gap-2"
                    >
                      <span className="text-center font-mono text-[10px] text-fg-2">
                        {a.value}
                      </span>

                      <div
                        className={`bar rounded-t-md ${peak ? "bg-brand shadow-glow" : "bg-brand/40"}`}
                        style={{
                          height: `${(a.value / max) * 85}%`,
                          transitionDelay: `${i * 70}ms`,
                        }}
                      />
                    </div>
                  );
                })}
              </div>

              <div className="mt-3 flex gap-2.5">
                {areaPrices.map((a) => (
                  <span
                    key={a.label}
                    title={a.label}
                    className="flex-1 truncate text-center text-[10px] text-fg-muted"
                  >
                    {a.label}
                  </span>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
