"use client";

import { useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { HeroMessages } from "@/i18n/dictionary.type";
import { fieldClass as field } from "@/libs/styles";
import { Dropdown } from "@/components/ui/DropDown";

export function SearchBox({ t }: { t: HeroMessages["search"] }) {
    const [tab, setTab] = useState<keyof typeof t.tabs>("all");
    const [price, setPrice] = useState("");
    const [type, setType] = useState("");

    return (
        <form
            onSubmit={(e) => e.preventDefault()}
            className="glass p-5 shadow-panel"
        >
            {/* Tabs */}
            <div className="mb-4 flex flex-wrap gap-2">
                {(Object.keys(t.tabs) as (keyof typeof t.tabs)[]).map((k) => (
                    <button
                        key={k}
                        type="button"
                        aria-pressed={tab === k}
                        onClick={() => setTab(k)}
                        className={`rounded-full px-4 py-1.5 text-xs font-medium transition ${
                            tab === k
                                ? "bg-brand text-brand-ink"
                                : "text-fg-2 hover:text-brand-text"
                        }`}
                    >
                        {t.tabs[k]}
                    </button>
                ))}
            </div>

            {/* Search fields */}
            <div className="grid gap-3 sm:grid-cols-2">
                {/* Location */}
                <label className="sm:col-span-2">
                    <span className="micro mb-2 block">
                        {t.locationLabel}
                    </span>

                    <input
                        className={field}
                        placeholder={t.locationPlaceholder}
                    />
                </label>

                {/* Price */}
                <div className="min-w-0">
                    <span className="micro mb-2 block">
                        {t.priceLabel}
                    </span>

                    <Dropdown
                        fullWidth
                        value={price}
                        onChange={setPrice}
                    >
                        <Dropdown.Trigger className="w-full">
                            <span className={price ? "" : "dropdown-placeholder"}>
                                {price
                                    ? t.priceOptions[price as keyof typeof t.priceOptions]
                                    : t.pricePlaceholder}
                            </span>
                        </Dropdown.Trigger>

                        <Dropdown.Content >
                            {Object.entries(t.priceOptions).map(([k, v]) => (
                                <Dropdown.Item key={k} value={k}>
                                    {v}
                                </Dropdown.Item>
                            ))}
                        </Dropdown.Content>
                    </Dropdown>
                </div>

                {/* Room type */}
                <div className="min-w-0">
                    <span className="micro mb-2 block">
                        {t.typeLabel}
                    </span>

                    <Dropdown
                        fullWidth
                        value={type}
                        onChange={setType}
                    >
                        <Dropdown.Trigger className="w-full">
                            <span className={type ? "" : "dropdown-placeholder"}>
                                {type
                                    ? t.typeOptions[type as keyof typeof t.typeOptions]
                                    : t.typePlaceholder}
                            </span>
                        </Dropdown.Trigger>

                        <Dropdown.Content >
                            {Object.entries(t.typeOptions).map(([k, v]) => (
                                <Dropdown.Item key={k} value={k}>
                                    {v}
                                </Dropdown.Item>
                            ))}
                        </Dropdown.Content>
                    </Dropdown>
                </div>
            </div>

            {/* Search button */}
            <button
                type="submit"
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-brand py-3 text-sm font-medium text-brand-ink shadow-glow transition hover:brightness-110"
            >
                <Icon name="search" className="size-4" />
                {t.searchButton}
            </button>

            {/* Trending */}
            <div className="mt-4 flex flex-wrap items-center gap-2">
                <span className="text-xs text-fg-muted">
                    {t.trendingLabel}
                </span>

                {t.trendingTags.map((tag) => (
                    <button
                        key={tag}
                        type="button"
                        className="rounded-full border border-line px-3 py-1 text-xs text-fg-2 transition hover:border-brand hover:text-brand-text"
                    >
                        {tag}
                    </button>
                ))}
            </div>
        </form>
    );
}
