import { Reveal } from "@/components/ui/Reveal";
import { SearchBox } from "../common/SearchBox";
import { HeroVisual } from "./HeroVisual";
import { HeroMessages } from "@/i18n/dictionary.type";
24
export function LandingPageHeroSection({ t, }: { t: HeroMessages }) {
    return (
        <section className="relative flex min-h-screen w-full items-center justify-center px-6 pb-12">
            <div className="mx-auto grid w-full items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20">
                <div>
                    <Reveal>
                        <span className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-4 py-1.5 text-xs text-fg-2">
                            <span className="size-1.5 animate-pulse rounded-full bg-brand" />
                            {t.badge}
                        </span>
                    </Reveal>

                    <Reveal delay={100}>
                        <h1 className="mt-6 text-[56px] font-medium leading-[1.05] tracking-[-0.03em] xl:text-[68px]">
                            {t.titlePart1} <span className="text-brand-text">{t.titlePart2}</span>
                        </h1>
                    </Reveal>

                    <Reveal delay={200}>
                        <p className="mt-6 text-lg text-fg-2">
                            {t.description}
                        </p>
                    </Reveal>

                    <Reveal delay={300} className="mt-9">
                        <SearchBox t={t.search} />
                    </Reveal>
                </div>

                <Reveal delay={250}>
                    <HeroVisual t={t.floatingCards} />
                </Reveal>
            </div>
        </section>
    );
}
