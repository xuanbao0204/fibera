'use client';

import { useMemo, useState } from 'react';

import {
    ArrowDownWideNarrow,
    ChevronLeft,
    ChevronRight,
    Filter,
    Heart,
    Search,
    X,
} from 'lucide-react';

import { mockRoomFeed } from '../mock-data/mock-room';

import { RoomFilters } from './room-filters';
import { RoomListingCard } from './room-listing-card';

import type {
    RoomFeedFilters,
    RoomFeedItem,
    RoomFeedSort,
} from '../types/room-feed.type';

import { Locale } from '@/i18n/config';
import { ROOM_FEED_PAGE_SIZE } from '../constants/room-feed.constant';
import { CommonMessage, EnumMessages, RoomFeedMessage } from '@/i18n/dictionary.type';
import { formatMessage, plural } from '@/i18n/format';
import { AMENITY_CODES } from '@/types/enums/amenity.type';
import { AMENITY_CONFIG } from '@/types/constants/amenity.const';

const initialFilters: RoomFeedFilters = {
    city: '',
    district: '',
    roomType: 'ALL',
    layout: 'ALL',
    minPrice: '',
    maxPrice: '',
    minArea: '',
    maxArea: '',
    amenityCodes: [],
    furnishedOnly: false,
    verifiedOnly: false,
};

function normalize(value: string): string {
    return value
        .toLocaleLowerCase('vi')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd');
}

function sortRoomFeed(
    items: RoomFeedItem[],
    sort: RoomFeedSort,
): RoomFeedItem[] {
    return [...items].sort((a, b) => {
        const dateA = Date.parse(a.post.publishedAt ?? '');
        const dateB = Date.parse(b.post.publishedAt ?? '');

        switch (sort) {
            case 'newest':
                return dateB - dateA;

            case 'price-asc':
                return a.price.rent - b.price.rent;

            case 'price-desc':
                return b.price.rent - a.price.rent;

            case 'area-desc':
                return b.room.areaM2 - a.room.areaM2;

            case 'recommended':
            default:
                return (
                    Number(b.landlord.identityVerified) -
                    Number(a.landlord.identityVerified) ||
                    dateB - dateA
                );
        }
    });
}

function matchesFilters(
    item: RoomFeedItem,
    filters: RoomFeedFilters,
): boolean {
    const { room, price, landlord, post } = item;

    if (
        room.status !== 'PUBLISHED' ||
        post.moderationStatus !== 'APPROVED'
    ) {
        return false;
    }

    if (
        filters.city &&
        normalize(room.address.city) !== normalize(filters.city)
    ) {
        return false;
    }

    if (
        filters.district &&
        normalize(room.address.district) !== normalize(filters.district)
    ) {
        return false;
    }

    if (
        filters.roomType !== 'ALL' &&
        room.category !== filters.roomType
    ) {
        return false;
    }

    if (
        filters.layout !== 'ALL' &&
        room.layout !== filters.layout
    ) {
        return false;
    }

    if (filters.minPrice && price.rent < Number(filters.minPrice)) {
        return false;
    }

    if (filters.maxPrice && price.rent > Number(filters.maxPrice)) {
        return false;
    }

    if (filters.minArea && room.areaM2 < Number(filters.minArea)) {
        return false;
    }

    if (filters.maxArea && room.areaM2 > Number(filters.maxArea)) {
        return false;
    }

    if (
        filters.amenityCodes.length > 0 &&
        !filters.amenityCodes.every((id) =>
            room.amenityCodes.some((amenity) => amenity === id),
        )
    ) {
        return false;
    }

    if (filters.furnishedOnly && !room.furnished) {
        return false;
    }

    if (filters.verifiedOnly && !landlord.identityVerified) {
        return false;
    }

    return true;
}

export function RoomFeedClient({ lang, t, common, enums }: { lang: Locale; t: RoomFeedMessage; common: CommonMessage; enums: EnumMessages; }) {
    const [keyword, setKeyword] = useState('');
    const [sort, setSort] = useState<RoomFeedSort>('recommended');
    const [filters, setFilters] = useState<RoomFeedFilters>(initialFilters);

    const [page, setPage] = useState(1);
    const [savedIds, setSavedIds] = useState<string[]>([]);
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

    const sortOptions = Object.entries(t.sort) as [
        RoomFeedSort,
        string,
    ][];

    const cities = useMemo(
        () =>
            Array.from(
                new Set(
                    mockRoomFeed.map((item) => item.room.address.city),
                ),
            ).sort((a, b) => a.localeCompare(b, 'vi')),
        [],
    );

    const districts = useMemo(
        () =>
            Array.from(
                new Set(
                    mockRoomFeed
                        .filter(
                            (item) =>
                                !filters.city ||
                                item.room.address.city === filters.city,
                        )
                        .map((item) => item.room.address.district),
                ),
            ).sort((a, b) => a.localeCompare(b, 'vi')),
        [filters.city],
    );

    const filteredItems = useMemo(() => {
        const query = normalize(keyword.trim());

        const matched = mockRoomFeed.filter((item) => {
            if (!matchesFilters(item, filters)) {
                return false;
            }

            if (!query) {
                return true;
            }

            const searchableContent = normalize(
                [
                    item.post.title,
                    item.post.content,
                    item.room.address.street,
                    item.room.address.ward,
                    item.room.address.district,
                    item.room.address.city,
                    item.landlord.fullName,
                    item.landlord.displayName ?? '',
                ].join(' '),
            );

            return searchableContent.includes(query);
        });

        return sortRoomFeed(matched, sort);
    }, [keyword, filters, sort]);

    const pageCount = Math.max(
        1,
        Math.ceil(filteredItems.length / ROOM_FEED_PAGE_SIZE),
    );

    const currentItems = useMemo(() => {
        const start = (page - 1) * ROOM_FEED_PAGE_SIZE;

        return filteredItems.slice(
            start,
            start + ROOM_FEED_PAGE_SIZE,
        );
    }, [filteredItems, page]);

    const activeFilterCount = [
        filters.city,
        filters.district,
        filters.roomType !== 'ALL',
        filters.layout !== 'ALL',
        filters.minPrice,
        filters.maxPrice,
        filters.minArea,
        filters.maxArea,
        filters.amenityCodes.length > 0,
        filters.furnishedOnly,
        filters.verifiedOnly,
    ].filter(Boolean).length;

    const resultStart =
        filteredItems.length === 0
            ? 0
            : (page - 1) * ROOM_FEED_PAGE_SIZE + 1;

    const resultEnd = Math.min(
        page * ROOM_FEED_PAGE_SIZE,
        filteredItems.length,
    );

    const handleFilterChange = (nextFilters: RoomFeedFilters) => {
        setFilters(nextFilters);
        setPage(1);
    };

    const handleClearFilters = () => {
        setFilters(initialFilters);
        setKeyword('');
        setSort('recommended');
        setPage(1);
    };

    const handleSearch = (value: string) => {
        setKeyword(value);
        setPage(1);
    };

    const handleToggleSaved = (roomId: string) => {
        setSavedIds((current) =>
            current.includes(roomId)
                ? current.filter((id) => id !== roomId)
                : [...current, roomId],
        );
    };

    const handleSortChange = (value: RoomFeedSort) => {
        setSort(value);
        setPage(1);
    };

    return (
        <main className="min-h-screen bg-bg text-fg">
            <div className="mx-auto w-full max-w-360 px-4 pb-16 pt-8 sm:px-6 lg:px-8">
                <header className="relative mb-8 overflow-hidden rounded-card border border-line bg-surface shadow-panel">
                    <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-brand/15 via-brand/5 to-transparent" />

                    <div className="pointer-events-none absolute -right-20 -top-32 size-80 rounded-full bg-brand/10 blur-3xl" />

                    <div className="relative px-6 py-10 md:px-10 md:py-12">
                        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-brand/20 bg-brand/10 px-3 py-1.5 text-xs font-semibold tracking-wide text-brand-text">
                            <span className="size-1.5 animate-pulse rounded-full bg-brand" />
                            {t.hero.eyebrow}
                        </div>

                        <h1 className="max-w-3xl text-3xl font-medium leading-tight tracking-[-0.03em] text-fg sm:text-4xl lg:text-5xl">
                            {t.hero.title}
                            <span className="text-brand-text">
                                {' '}{t.hero.titleHighlight}
                            </span>
                        </h1>

                        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-fg-2 sm:text-base">
                            {t.hero.description}
                        </p>

                        <div className="mt-7 flex flex-wrap gap-6">
                            <div>
                                <p className="text-2xl font-semibold text-fg">
                                    {mockRoomFeed.length}+
                                </p>
                                <p className="text-xs text-fg-muted">
                                    {t.stats.listings}
                                </p>
                            </div>

                            <div className="h-10 w-px bg-line" />

                            <div>
                                <p className="text-2xl font-semibold text-fg">
                                    {AMENITY_CODES.length}
                                </p>
                                <p className="text-xs text-fg-muted">
                                    {t.stats.amenities}
                                </p>
                            </div>

                            <div className="h-10 w-px bg-line" />

                            <div>
                                <p className="text-2xl font-semibold text-fg">
                                    {cities.length}
                                </p>
                                <p className="text-xs text-fg-muted">
                                    {common.terms.provinceCity}
                                </p>
                            </div>
                        </div>
                    </div>
                </header>

                <form
                    onSubmit={(event) => event.preventDefault()}
                    className="mb-8 flex flex-col gap-3 rounded-panel border border-line bg-surface p-2 shadow-panel sm:flex-row"
                >
                    <div className="flex min-w-0 flex-1 items-center gap-3 px-3">
                        <Search
                            size={21}
                            className="shrink-0 text-brand-text"
                        />

                        <input
                            type="search"
                            value={keyword}
                            onChange={(event) => handleSearch(event.target.value)}
                            placeholder={t.search.placeholder}
                            aria-label={t.search.ariaLabel}
                            className="h-12 w-full bg-transparent text-sm text-fg outline-none placeholder:text-fg-muted"
                        />

                        {keyword && (
                            <button
                                type="button"
                                onClick={() => handleSearch('')}
                                aria-label={t.search.clear}
                                className="rounded-full p-1.5 text-fg-muted transition hover:bg-surface-hover hover:text-fg"
                            >
                                <X size={16} />
                            </button>
                        )}
                    </div>

                    <button
                        type="submit"
                        className="flex h-12 items-center justify-center gap-2 rounded-xl bg-brand px-7 text-sm font-semibold text-brand-ink transition hover:bg-brand-deep hover:shadow-glow"
                    >
                        <Search size={17} />
                        {t.search.submit}
                    </button>
                </form>

                <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-7">
                    <aside className="hidden lg:block">
                        <div className="sticky top-24">
                            <RoomFilters
                                t={t}
                                lang={lang}
                                common={common}
                                enums={enums}
                                filters={filters}
                                cities={cities}
                                districts={districts}
                                activeCount={activeFilterCount}
                                onChange={handleFilterChange}
                                onClear={handleClearFilters}
                            />
                        </div>
                    </aside>

                    <section className="min-w-0">
                        <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <h2 className="text-xl font-semibold tracking-tight text-fg">
                                    {t.results.title}
                                </h2>

                                <p className="mt-1 text-sm text-fg-muted">
                                    {formatMessage(t.results.summary, { from: resultStart, to: resultEnd, total: filteredItems.length })}
                                </p>
                            </div>

                            <div className="flex flex-wrap items-center gap-2">
                                <button
                                    type="button"
                                    onClick={() => setMobileFiltersOpen(true)}
                                    className="inline-flex h-10 items-center gap-2 rounded-xl border border-line bg-surface px-3 text-sm font-medium text-fg transition hover:border-brand/40 hover:bg-surface-hover lg:hidden"
                                >
                                    <Filter size={16} className="text-brand-text" />
                                    {t.results.filterButton}
                                    {activeFilterCount > 0 && (
                                        <span className="flex size-5 items-center justify-center rounded-full bg-brand text-[11px] font-semibold text-brand-ink">
                                            {activeFilterCount}
                                        </span>
                                    )}
                                </button>

                                <label
                                    htmlFor="room-sort"
                                    className="flex h-10 items-center gap-2 rounded-xl border border-line bg-surface px-3 transition hover:border-brand/40"
                                >
                                    <ArrowDownWideNarrow
                                        size={16}
                                        className="text-brand-text"
                                    />

                                    <span className="hidden text-xs text-fg-muted sm:inline">
                                        {t.results.sortLabel}
                                    </span>

                                    <select
                                        id="room-sort"
                                        value={sort}
                                        onChange={(event) =>
                                            handleSortChange(
                                                event.target.value as RoomFeedSort,
                                            )
                                        }
                                        className="max-w-37.5 bg-transparent text-sm font-semibold text-fg outline-none"
                                    >
                                        {sortOptions.map(([value, label]) => (
                                            <option
                                                key={value}
                                                value={value}
                                                className="bg-surface text-fg"
                                            >
                                                {label}
                                            </option>
                                        ))}
                                    </select>
                                </label>
                            </div>
                        </div>

                        {activeFilterCount > 0 && (
                            <div className="mb-5 flex flex-wrap items-center gap-2">
                                <span className="text-xs text-fg-muted">
                                    {t.activeFilters.title}
                                </span>

                                {filters.city && (
                                    <span className="rounded-full border border-brand/15 bg-brand/10 px-3 py-1.5 text-xs font-medium text-brand-text">
                                        {filters.city}
                                    </span>
                                )}

                                {filters.district && (
                                    <span className="rounded-full border border-brand/15 bg-brand/10 px-3 py-1.5 text-xs font-medium text-brand-text">
                                        {filters.district}
                                    </span>
                                )}

                                {filters.roomType !== 'ALL' && (
                                    <span className="rounded-full border border-brand/15 bg-brand/10 px-3 py-1.5 text-xs font-medium text-brand-text">
                                        {enums.roomType[filters.roomType]}
                                    </span>
                                )}

                                {filters.layout !== 'ALL' && (
                                    <span className="rounded-full border border-brand/15 bg-brand/10 px-3 py-1.5 text-xs font-medium text-brand-text">
                                        {enums.roomLayout[filters.layout]}
                                    </span>
                                )}

                                {(filters.minPrice || filters.maxPrice) && (
                                    <span className="rounded-full border border-brand/15 bg-brand/10 px-3 py-1.5 text-xs font-medium text-brand-text">
                                        {t.activeFilters.price}
                                    </span>
                                )}

                                {(filters.minArea || filters.maxArea) && (
                                    <span className="rounded-full border border-brand/15 bg-brand/10 px-3 py-1.5 text-xs font-medium text-brand-text">
                                        {common.terms.area}
                                    </span>
                                )}

                                {filters.amenityCodes.length > 0 && (
                                    <span className="rounded-full border border-brand/15 bg-brand/10 px-3 py-1.5 text-xs font-medium text-brand-text">
                                        {plural(lang, t.activeFilters.amenities, filters.amenityCodes.length)}
                                    </span>
                                )}

                                {filters.furnishedOnly && (
                                    <span className="rounded-full border border-brand/15 bg-brand/10 px-3 py-1.5 text-xs font-medium text-brand-text">
                                        {common.terms.furnished}
                                    </span>
                                )}

                                {filters.verifiedOnly && (
                                    <span className="rounded-full border border-brand/15 bg-brand/10 px-3 py-1.5 text-xs font-medium text-brand-text">
                                        {common.terms.verifiedLandlord}
                                    </span>
                                )}

                                <button
                                    type="button"
                                    onClick={handleClearFilters}
                                    className="text-xs font-medium text-fg-muted underline-offset-4 transition hover:text-brand-text hover:underline"
                                >
                                    {common.actions.clearFilters}
                                </button>
                            </div>
                        )}

                        {currentItems.length > 0 ? (
                            <div className="space-y-5">
                                {currentItems.map((item) => (
                                    <RoomListingCard
                                        key={item.room.id}
                                        item={item}
                                        t={t}
                                        lang={lang}
                                        common={common}
                                        enums={enums}
                                        isSaved={savedIds.includes(item.room.id)}
                                        onToggleSaved={handleToggleSaved}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="flex min-h-100 flex-col items-center justify-center rounded-card border border-dashed border-line bg-surface px-6 py-12 text-center">
                                <div className="mb-5 flex size-16 items-center justify-center rounded-2xl border border-brand/15 bg-brand/10 text-brand-text">
                                    <Search size={28} />
                                </div>

                                <h3 className="text-lg font-semibold text-fg">
                                    {t.empty.title}
                                </h3>

                                <p className="mt-2 max-w-sm text-sm leading-relaxed text-fg-2">
                                    {t.empty.description}
                                </p>

                                <button
                                    type="button"
                                    onClick={handleClearFilters}
                                    className="mt-6 rounded-xl bg-brand px-5 py-2.5 text-sm font-semibold text-brand-ink transition hover:bg-brand-deep hover:shadow-glow"
                                >
                                    {common.actions.clearFilters}
                                </button>
                            </div>
                        )}

                        {filteredItems.length > 0 && (
                            <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-line pt-6 sm:flex-row">
                                <p className="text-sm text-fg-muted">
                                    {t.pagination.page}{' '}
                                    <span className="font-semibold text-fg">
                                        {page}
                                    </span>{' '}
                                    / {pageCount}
                                </p>

                                <nav
                                    aria-label="Phân trang danh sách phòng"
                                    className="flex items-center gap-1.5"
                                >
                                    <button
                                        type="button"
                                        disabled={page === 1}
                                        onClick={() =>
                                            setPage((current) => Math.max(1, current - 1))
                                        }
                                        aria-label={t.pagination.previous}
                                        className="flex size-10 items-center justify-center rounded-xl border border-line bg-surface text-fg transition hover:border-brand hover:bg-surface-hover hover:text-brand-text disabled:cursor-not-allowed disabled:opacity-40"
                                    >
                                        <ChevronLeft size={18} />
                                    </button>

                                    {Array.from(
                                        { length: pageCount },
                                        (_, index) => index + 1,
                                    ).map((pageNumber) => (
                                        <button
                                            key={pageNumber}
                                            type="button"
                                            onClick={() => setPage(pageNumber)}
                                            aria-label={`Trang ${pageNumber}`}
                                            aria-current={
                                                page === pageNumber ? 'page' : undefined
                                            }
                                            className={`flex size-10 items-center justify-center rounded-xl text-sm font-semibold transition ${page === pageNumber
                                                ? 'bg-brand text-brand-ink shadow-glow'
                                                : 'border border-line bg-surface text-fg hover:border-brand hover:bg-surface-hover hover:text-brand-text'
                                                }`}
                                        >
                                            {pageNumber}
                                        </button>
                                    ))}

                                    <button
                                        type="button"
                                        disabled={page >= pageCount}
                                        onClick={() =>
                                            setPage((current) =>
                                                Math.min(pageCount, current + 1),
                                            )
                                        }
                                        aria-label={t.pagination.next}
                                        className="flex size-10 items-center justify-center rounded-xl border border-line bg-surface text-fg transition hover:border-brand hover:bg-surface-hover hover:text-brand-text disabled:cursor-not-allowed disabled:opacity-40"
                                    >
                                        <ChevronRight size={18} />
                                    </button>
                                </nav>
                            </div>
                        )}

                        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-panel border border-line bg-surface p-4">
                            <div className="flex items-center gap-3">
                                <div className="flex size-10 items-center justify-center rounded-xl border border-brand/15 bg-brand/10 text-brand-text">
                                    <Heart size={19} />
                                </div>

                                <div>
                                    <p className="text-sm font-semibold text-fg">
                                        {t.saved.title}
                                    </p>
                                    <p className="text-xs text-fg-muted">
                                        {plural(lang, t.saved.description, savedIds.length)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>

            {mobileFiltersOpen && (
                <div className="fixed inset-0 z-50 lg:hidden">
                    <button
                        type="button"
                        aria-label="Đóng bộ lọc"
                        onClick={() => setMobileFiltersOpen(false)}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    />

                    <div
                        role="dialog"
                        aria-modal="true"
                        aria-label="Bộ lọc tìm kiếm"
                        className="absolute inset-y-0 left-0 w-[min(90%,400px)] overflow-y-auto border-r border-line bg-bg p-4 shadow-panel"
                    >
                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-fg">
                                {t.filters.title}
                            </h2>

                            <button
                                type="button"
                                onClick={() => setMobileFiltersOpen(false)}
                                aria-label="Đóng"
                                className="flex size-9 items-center justify-center rounded-full border border-line text-fg-muted transition hover:bg-surface-hover hover:text-fg"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <RoomFilters
                            t={t}
                            lang={lang}
                            common={common}
                            enums={enums}
                            filters={filters}
                            cities={cities}
                            districts={districts}
                            activeCount={activeFilterCount}
                            resultCount={filteredItems.length}
                            onChange={handleFilterChange}
                            onClear={handleClearFilters}
                            onClose={() => setMobileFiltersOpen(false)}
                        />
                    </div>
                </div>
            )}
        </main>
    );
}
