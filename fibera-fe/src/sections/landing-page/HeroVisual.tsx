import { Icon } from "@/components/ui/Icon";
import { HeroMessages } from "@/i18n/dictionary.type";

export function HeroVisual({ t }: { t: HeroMessages["floatingCards"] }) {
  return (
    <div className="relative mx-auto w-full max-w-[520px]">
      <div className="glass relative aspect-[4/4.4] overflow-hidden p-3 shadow-panel">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/70 to-transparent" />
        <div className="animate-scan pointer-events-none absolute inset-y-0 left-0 w-[18%] bg-gradient-to-r from-transparent via-brand/25 to-transparent" />
        <svg viewBox="0 0 400 440" className="size-full rounded-[1.1rem]" role="img" aria-label="Minh họa phòng studio">
          <rect width="400" height="440" className="fill-brand/10" />
          <polygon points="95,60 330,440 40,440" className="fill-brand/10" />
          <rect x="60" y="50" width="140" height="180" rx="14" className="fill-brand/20 stroke-line" />
          <path d="M130 50v180M60 140h140" className="stroke-line" strokeWidth="2" />
          <rect x="30" y="310" width="270" height="86" rx="16" className="fill-fg/10" />
          <rect x="30" y="280" width="30" height="116" rx="12" className="fill-fg/20" />
          <rect x="74" y="292" width="70" height="32" rx="12" className="fill-cream/70" />
          <rect x="30" y="396" width="270" height="10" rx="5" className="fill-fg/15" />
          <path d="M340 150v190" className="stroke-fg-2" strokeWidth="3" />
          <path d="M310 150h60l-12-34h-36z" className="fill-brand" />
          <circle cx="340" cy="360" r="24" className="fill-brand-deep/60" />
          <path d="M340 360c-18-30-6-52 0-64 6 12 18 34 0 64z" className="fill-brand/70" />
        </svg>
      </div>

      <div className="glass animate-float absolute -left-3 top-[18%] flex items-center gap-3 p-3 pr-5 shadow-panel sm:-left-10">
        <span className="grid size-10 place-items-center rounded-full bg-brand text-brand-ink"><Icon name="shield" /></span>
        <div>
          <p className="text-sm font-medium">{t.verifiedTitle}</p>
          <p className="text-xs text-fg-2">{t.verifiedSubtitle}</p>
        </div>
      </div>

      <div className="glass animate-float absolute -right-3 bottom-[8%] p-4 shadow-panel [animation-delay:-3s] sm:-right-8">
        <div className="flex items-center gap-1 text-brand-text">
          <Icon name="star" className="size-4" />
          <span className="font-mono text-sm font-bold text-fg">{t.rating}</span>
          <span className="text-xs text-fg-2">{t.reviews}</span>
        </div>
        <p className="mt-2 text-sm font-medium">{t.matchedRoom}</p>
        <p className="font-mono text-lg font-bold text-brand-text">{t.pricePerMonth}</p>
        <p className="text-xs text-fg-2">{t.district}</p>
      </div>
    </div>
  );
}
