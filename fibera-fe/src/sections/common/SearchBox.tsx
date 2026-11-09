"use client";
import { Icon } from "@/components/ui/Icon";
import { HeroMessages } from "@/i18n/dictionary.type";
import { useState } from "react";

const field = "w-full rounded-panel border border-line bg-surface px-4 py-3 text-sm text-fg outline-none transition placeholder:text-fg-muted focus:border-brand";

export function SearchBox({ t }: { t: HeroMessages["search"] }) {
  const [tab, setTab] = useState<keyof typeof t.tabs>("all");
  return (
    <form onSubmit={(e) => e.preventDefault()} className="glass p-5 shadow-panel">
      <div className="mb-4 flex flex-wrap gap-2">
        {(Object.keys(t.tabs) as (keyof typeof t.tabs)[]).map((k) => (
          <button key={k} type="button" onClick={() => setTab(k)}
            className={`rounded-full px-4 py-1.5 text-xs font-medium transition ${tab === k ? "bg-brand text-brand-ink" : "text-fg-2 hover:text-brand-text"}`}>
            {t.tabs[k]}
          </button>
        ))}
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="sm:col-span-2">
          <span className="micro mb-2 block">{t.locationLabel}</span>
          <input className={field} placeholder={t.locationPlaceholder} />
        </label>
        <label>
          <span className="micro mb-2 block">{t.priceLabel}</span>
          <select className={field} defaultValue="">
            <option value="">{t.pricePlaceholder}</option>
            {Object.entries(t.priceOptions).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
        </label>
        <label>
          <span className="micro mb-2 block">{t.typeLabel}</span>
          <select className={field} defaultValue="">
            <option value="">{t.typePlaceholder}</option>
            {Object.entries(t.typeOptions).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
        </label>
      </div>
      <button type="submit" className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-brand py-3 text-sm font-medium text-brand-ink shadow-glow transition hover:brightness-110">
        <Icon name="search" className="size-4" /> {t.searchButton}
      </button>
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span className="text-xs text-fg-muted">{t.trendingLabel}</span>
        {t.trendingTags.map((tag) => (
          <span key={tag} className="cursor-pointer rounded-full border border-line px-3 py-1 text-xs text-fg-2 transition hover:border-brand hover:text-brand-text">{tag}</span>
        ))}
      </div>
    </form>
  );
}
