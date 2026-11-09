import { CountUp } from "@/components/ui/CountUp";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { Dictionary, LandingStats } from "@/i18n/dictionary.type";

export function Analysis({ t }: { t: LandingStats }) {
  const stats = [
    { v: t.verifiedRooms, l: t.verifiedRoomsLabel },
    { v: t.happyTenants, l: t.happyTenantsLabel },
    { v: t.savingFee, l: t.savingFeeLabel },
    { v: t.aiMatch, l: t.aiMatchLabel },
  ];

  // const max = Math.max(...areaPrices.map((a) => a.v));

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

        <div className="mt-14 grid gap-5 lg:grid-cols-12">
          <div className="grid gap-5 sm:grid-cols-2 lg:col-span-7">
            {stats.map((x, i) => (
              <Reveal key={x.l} delay={i * 80}>
                <div className="glass glass-hover h-full p-7">
                  <p className="font-mono text-5xl font-bold tracking-tight text-brand-text">
                    <CountUp value={x.v} />
                  </p>
                  <p className="mt-3 text-sm text-fg-2">{x.l}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal className="lg:col-span-5" delay={200}>
            <div className="glass h-full p-7">
              <p className="micro">
                {t.chart.title} · {t.chart.unit}
              </p>

              <div className="mt-8 flex h-56 items-end gap-2.5">
                {/* {areaPrices.map((a, i) => {
                  const peak = a.v === max;

                  return (
                    <div
                      key={a.label}
                      className="group flex h-full flex-1 flex-col justify-end gap-2"
                    >
                      <span className="text-center font-mono text-[10px] text-fg-2">
                        {a.v}
                      </span>

                      <div
                        className={`bar rounded-t-md ${
                          peak
                            ? "bg-brand shadow-glow"
                            : "bg-brand/40"
                        }`}
                        style={{
                          height: `${(a.v / max) * 100}%`,
                          transitionDelay: `${i * 70}ms`,
                        }}
                      />
                    </div>
                  );
                })} */}
              </div>

              {/* <div className="mt-3 flex gap-2.5">
                {areaPrices.map((a) => (
                  <span
                    key={a.label}
                    className="flex-1 truncate text-center text-[10px] text-fg-muted"
                  >
                    {a.label}
                  </span>
                ))}
              </div> */}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}