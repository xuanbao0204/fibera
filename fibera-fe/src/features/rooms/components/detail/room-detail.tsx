'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';

import {
    ArrowLeft,
    BadgeCheck,
    ChevronRight,
    Droplets,
    MapPin,
    MapPinned,
    ShieldCheck,
    SquareText,
    Zap,
} from 'lucide-react';

import type { RoomFeedItem } from '../../types/room-feed.type';

import { mockRoomFeed } from '../../mock-data/mock-room';

import {
    formatCompactPrice,
    formatPrice,
} from '../../constants/room-feed.constant';

import { RoomGallery } from './room-gallery';
import { RoomContactPanel } from './room-contact-panel';
import { RelatedRoomCard } from './related-room-card';
import { AMENITY_CONFIG } from '@/types/constants/amenity.const';
import { Locale } from '@/i18n/config';
import { CommonMessage, EnumMessages, RoomDetailMessage } from '@/i18n/dictionary.type';
import { PriceEstimate } from './price-estimate';
import { formatMessage, plural } from '@/i18n/format';
import { PromotionList } from '../promotion/promotion-list';
import { calculatePayment } from '@/types/constants/promotion.calculator';

interface RoomDetailClientProps {
    item: RoomFeedItem;
    lang: Locale
    t: RoomDetailMessage;
    common: CommonMessage;
    enums: EnumMessages;

}

function DetailSection({
    title,
    description,
    children,
}: {
    title: string;
    description?: string;
    children: React.ReactNode;
}) {
    return (
        <section className="rounded-card border border-line bg-surface p-5 shadow-panel md:p-6">
            <div className="mb-5">
                <h2 className="text-lg font-semibold tracking-tight text-fg md:text-xl">
                    {title}
                </h2>

                {description && (
                    <p className="mt-1.5 text-sm leading-relaxed text-fg-muted">
                        {description}
                    </p>
                )}
            </div>

            {children}
        </section>
    );
}

function InfoItem({
    label,
    value,
}: {
    label: string;
    value: string;
}) {
    return (
        <div className="flex flex-col gap-1.5 rounded-xl border border-line bg-bg p-3.5">
            <span className="text-xs text-fg-muted">{label}</span>
            <span className="text-sm font-semibold text-fg">{value}</span>
        </div>
    );
}

export function RoomDetailClient({
    item,
    lang,
    t,
    common,
    enums
}: RoomDetailClientProps) {
    const [isSaved, setIsSaved] = useState(false);

    const { room, post, price, landlord, media, promotions } = item;
    const amenityCodes = room.amenityCodes;

    const location = [
        room.address.street,
        room.address.ward,
        room.address.district,
        room.address.city,
    ]
        .filter(Boolean)
        .join(', ');


    // Homestay: ở 1 đêm, tổng = tiền thuê sau ưu đãi + các khoản cố định + tiền cọc
    const dailyStay = calculatePayment(price, promotions, {
        leaseMonths: 1, // đổi thành periods: 1 nếu bạn đã đổi tên
        isStudent: false,
    });

    const dailyFees = [
        { label: t.pricing.water, value: price.waterRate },
        { label: t.pricing.serviceFee, value: price.serviceFee },
    ].filter((fee) => fee.value > 0);

    const dailyFeesTotal = dailyFees.reduce((sum, fee) => sum + fee.value, 0);

    // Tổng tiền 1 đêm (chưa gồm cọc)
    const dailyTotal = dailyStay.firstMonthRent + dailyFeesTotal;
    const dailyTotalOriginal = price.rent + dailyFeesTotal;

    // Cọc là khoản trả trước, trừ vào tổng; không để vượt quá tổng
    const dailyDeposit = Math.min(dailyStay.deposit, dailyTotal);
    const dailyRemaining = dailyTotal - dailyDeposit;

    const mapQuery =
        room.address.latitude != null &&
            room.address.longitude != null
            ? `${room.address.latitude},${room.address.longitude}`
            : location;

    const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapQuery)}`;

    const relatedItems = useMemo(() => {
        return mockRoomFeed
            .filter((candidate) => candidate.room.id !== room.id)
            .sort((a, b) => {
                const aScore =
                    Number(a.room.category === room.category) * 2 +
                    Number(a.room.address.city === room.address.city) +
                    Number(a.room.address.district === room.address.district);

                const bScore =
                    Number(b.room.category === room.category) * 2 +
                    Number(b.room.address.city === room.address.city) +
                    Number(b.room.address.district === room.address.district);

                return bScore - aScore;
            })
            .slice(0, 3);
    }, [room.id, room.category, room.address.city, room.address.district]);

    return (
        <main className="min-h-screen bg-transparent pb-16 text-fg">
            <div className="mx-auto w-full max-w-360 px-4 pt-6 sm:px-6 lg:px-8">
                <nav
                    aria-label={t.breadcrumb.ariaLabel}
                    className="mb-6 flex flex-wrap items-center gap-2 text-xs text-fg-muted sm:text-sm"
                >
                    <Link
                        href={`/${lang}`}
                        className="transition hover:text-brand-text"
                    >
                        {t.breadcrumb.home}
                    </Link>

                    <ChevronRight size={14} />

                    <Link
                        href={`/${lang}/rooms`}
                        className="transition hover:text-brand-text"
                    >
                        {t.breadcrumb.rooms}
                    </Link>

                    <ChevronRight size={14} />

                    <span className="max-w-50 truncate font-medium text-fg">
                        {room.title}
                    </span>
                </nav>

                <div className="mb-6">
                    <Link
                        href={`/${lang}/rooms`}
                        className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-fg-2 transition hover:text-brand-text"
                    >
                        <ArrowLeft size={17} />
                        {t.actions.backToList}
                    </Link>

                    <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                        <div className="min-w-0">
                            <div className="mb-3 flex flex-wrap items-center gap-2">
                                <span className="rounded-lg border border-brand/20 bg-brand/10 px-3 py-1.5 text-xs font-semibold text-brand-text">
                                    {enums.roomType[room.category]}
                                </span>

                                {room.verification === 'APPROVED' && (
                                    <span className="inline-flex items-center gap-1.5 rounded-lg border border-pos/20 bg-pos/10 px-3 py-1.5 text-xs font-semibold text-pos">
                                        <BadgeCheck size={14} />
                                        {t.badges.approved}
                                    </span>
                                )}
                            </div>

                            <h1 className="max-w-4xl text-2xl font-semibold leading-tight tracking-[-0.03em] text-fg sm:text-3xl lg:text-4xl">
                                {room.title}
                            </h1>

                            <div className="mt-3 flex items-start gap-2 text-sm text-fg-2">
                                <MapPin
                                    size={17}
                                    className="mt-0.5 shrink-0 text-brand-text"
                                />
                                <span>{location}</span>
                            </div>
                        </div>

                        <div className="flex shrink-0 items-center gap-2">
                            <button
                                type="button"
                                onClick={() => setIsSaved((current) => !current)}
                                aria-pressed={isSaved}
                                className={`flex h-10 items-center gap-2 rounded-xl border px-4 text-sm font-semibold transition ${isSaved
                                    ? 'border-neg/20 bg-neg/10 text-neg'
                                    : 'border-line bg-surface text-fg-2 hover:border-brand/40 hover:text-brand-text'
                                    }`}
                            >
                                <span className="text-base">
                                    {isSaved ? '♥' : '♡'}
                                </span>
                                {isSaved ? t.actions.saved : t.actions.save}
                            </button>
                        </div>
                    </div>
                </div>

                <RoomGallery
                    media={media}
                    title={room.title}
                />

                <div className="mt-8 grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-8">
                    <div className="min-w-0 space-y-6">
                        <DetailSection
                            title={t.overview.title}
                            description={t.overview.description}
                        >
                            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                                <InfoItem
                                    label={common.terms.area}
                                    value={`${room.areaM2} m²`}
                                />

                                <InfoItem
                                    label={t.overview.maxOccupants}
                                    value={plural(
                                        lang,
                                        t.overview.occupants,
                                        room.maxOccupants,
                                    )}
                                />

                                <InfoItem
                                    label={common.terms.layout}
                                    value={enums.roomLayout[room.layout]}
                                />

                                <InfoItem
                                    label={common.terms.roomType}
                                    value={enums.roomType[room.category]}
                                />

                                <InfoItem
                                    label={t.overview.furnished}
                                    value={
                                        room.furnished
                                            ? t.overview.furnishedValue.fully
                                            : t.overview.furnishedValue.basic
                                    }
                                />

                                <InfoItem
                                    label={t.overview.listingStatus}
                                    value={
                                        room.status === 'PUBLISHED'
                                            ? t.overview.statusValue.published
                                            : t.overview.statusValue.unpublished
                                    }
                                />
                            </div>
                        </DetailSection>

                        <DetailSection
                            title={t.about.title}
                            description={t.about.description}
                        >
                            <p className="whitespace-pre-line text-sm leading-7 text-fg-2">
                                {post.content || room.description || t.about.empty}
                            </p>
                        </DetailSection>

                        <DetailSection
                            title={t.amenities.title}
                            description={plural(
                                lang,
                                t.amenities.description,
                                amenityCodes.length,
                            )}
                        >
                            {amenityCodes.length > 0 ? (
                                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                                    {amenityCodes.map((code) => {
                                        const Icon = AMENITY_CONFIG[code].icon;

                                        return (
                                            <div
                                                key={code}
                                                className="flex items-center gap-3 rounded-xl border border-line bg-bg p-3"
                                            >
                                                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-brand/10 text-brand-text">
                                                    <Icon size={18} />
                                                </div>

                                                <span className="text-sm font-medium text-fg-2">
                                                    {enums.amenity[code]}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <p className="text-sm text-fg-muted">
                                    {t.amenities.empty}
                                </p>
                            )}
                        </DetailSection>

                        {promotions.length > 0 && (
                            <DetailSection
                                title={t.promotion.title}
                                description={t.promotion.description}
                            >
                                <PromotionList
                                    promotions={promotions}
                                    lang={lang}
                                    t={t}
                                    enums={enums}
                                />
                            </DetailSection>
                        )}

                        <DetailSection
                            title={t.pricing.title}
                            description={t.pricing.description}
                        >
                            <div className="overflow-hidden rounded-xl border border-line">
                                <div className="flex items-center justify-between gap-4 border-b border-line bg-brand/5 p-4">
                                    <div>
                                        <p className="text-sm font-semibold text-fg">
                                            {t.pricing.rent}
                                        </p>
                                        <p className="mt-1 text-xs text-fg-muted">
                                            {t.pricing.rentPeriod}
                                        </p>
                                    </div>

                                    <p className="text-lg font-bold text-brand-text">
                                        {formatCompactPrice(price.rent, lang)}
                                        <span className="ml-1 text-xs font-medium text-fg-muted">
                                            {t.pricing.period[price.period]}
                                        </span>
                                    </p>
                                </div>

                                <div className="divide-y divide-line">
                                    <div className="flex items-center justify-between gap-4 p-4">
                                        <span className="flex items-center gap-2 text-sm text-fg-2">
                                            <ShieldCheck size={15} className="text-brand-text" />
                                            {t.pricing.deposit}
                                        </span>
                                        <span className="text-sm font-semibold text-fg">
                                            {formatPrice(price.deposit, lang)}
                                        </span>
                                    </div>

                                    <div className="flex items-center justify-between gap-4 p-4">
                                        <span className="flex items-center gap-2 text-sm text-fg-2">
                                            <Zap size={15} className="text-brand-text" />
                                            {t.pricing.electricity}
                                        </span>
                                        <span className="text-sm font-semibold text-fg">
                                            {price.electricityRate > 0
                                                ? formatMessage(t.pricing.perKwh, {
                                                    price: formatPrice(price.electricityRate, lang),
                                                })
                                                : t.pricing.free
                                            }
                                        </span>
                                    </div>

                                    <div className="flex items-center justify-between gap-4 p-4">
                                        <span className="flex items-center gap-2 text-sm text-fg-2">
                                            <Droplets size={15} className="text-brand-text" />
                                            {t.pricing.water}
                                        </span>
                                        <span className="text-sm font-semibold text-fg">
                                            {price.waterRate > 0
                                                ? formatPrice(price.waterRate, lang)
                                                : t.pricing.free}
                                        </span>
                                    </div>

                                    <div className="flex items-center justify-between gap-4 p-4">
                                        <span className="flex items-center gap-2 text-sm text-fg-2">
                                            <SquareText size={15} className="text-brand-text" />
                                            {t.pricing.serviceFee}
                                        </span>
                                        <span className="text-sm font-semibold text-fg">
                                            {price.serviceFee > 0
                                                ? formatPrice(price.serviceFee, lang)
                                                : t.pricing.free}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {price.period === 'DAY' ? (
                                <div className="mt-4 rounded-xl border border-brand/30 bg-brand/5 p-4">
                                    <h3 className="text-sm font-semibold text-fg">
                                        {t.pricing.estimate.dayTitle}
                                    </h3>

                                    <div className="mt-4 space-y-3 border-t border-line pt-4 text-sm">
                                        <div className="flex items-center justify-between gap-4">
                                            <span className="text-fg-2">{t.pricing.estimate.dayRent}</span>
                                            <span>
                                                {dailyStay.firstMonthRent !== price.rent && (
                                                    <span className="mr-2 text-xs text-fg-muted line-through">
                                                        {formatPrice(price.rent, lang)}
                                                    </span>
                                                )}
                                                <span className="font-semibold text-fg">
                                                    {formatPrice(dailyStay.firstMonthRent, lang)}
                                                </span>
                                            </span>
                                        </div>

                                        {dailyFees.map((fee) => (
                                            <div key={fee.label} className="flex items-center justify-between gap-4">
                                                <span className="text-fg-2">{fee.label}</span>
                                                <span className="font-semibold text-fg">
                                                    {formatPrice(fee.value, lang)}
                                                </span>
                                            </div>
                                        ))}

                                        <div className="flex items-center justify-between gap-4 border-t border-line pt-3">
                                            <span className="font-semibold text-fg">
                                                {t.pricing.estimate.dayTotal}
                                            </span>
                                            <span>
                                                {dailyTotal !== dailyTotalOriginal && (
                                                    <span className="mr-2 text-xs text-fg-muted line-through">
                                                        {formatPrice(dailyTotalOriginal, lang)}
                                                    </span>
                                                )}
                                                <span className="font-semibold text-fg">
                                                    {formatPrice(dailyTotal, lang)}
                                                </span>
                                            </span>
                                        </div>

                                        {dailyDeposit > 0 && (
                                            <>
                                                <div className="flex items-center justify-between gap-4">
                                                    <span className="text-fg-2">
                                                        {t.pricing.estimate.depositPaid}
                                                    </span>
                                                    <span className="font-semibold text-fg">
                                                        − {formatPrice(dailyDeposit, lang)}
                                                    </span>
                                                </div>

                                                <div className="flex items-center justify-between gap-4 border-t border-line pt-3">
                                                    <span className="font-semibold text-fg">
                                                        {t.pricing.estimate.dayRemaining}
                                                    </span>
                                                    <span className="text-lg font-bold text-brand-text">
                                                        {formatPrice(dailyRemaining, lang)}
                                                    </span>
                                                </div>
                                            </>
                                        )}
                                    </div>

                                    {dailyStay.deposit > dailyTotal && (
                                        <p className="mt-3 text-xs text-fg-muted">
                                            {t.pricing.estimate.depositExcessNote}
                                        </p>
                                    )}

                                    <p className="mt-3 text-xs text-fg-muted font-bold">
                                        {t.pricing.estimate.caution}
                                    </p>
                                </div>
                            ) : (
                                <PriceEstimate
                                    price={price}
                                    promotions={promotions}
                                    lang={lang}
                                    t={t}
                                    enums={enums}
                                />
                            )}

                            <p className="mt-3 text-xs leading-relaxed text-fg-muted">
                                {t.pricing.note}
                            </p>
                        </DetailSection>

                        <DetailSection
                            title={t.location.title}
                            description={t.location.description}
                        >
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                                <div className="flex size-12 shrink-0 items-center justify-center rounded-xl border border-brand/15 bg-brand/10 text-brand-text">
                                    <MapPinned size={22} />
                                </div>

                                <div className="min-w-0 flex-1">
                                    <p className="text-sm font-semibold leading-relaxed text-fg">
                                        {location}
                                    </p>

                                    {room.address.latitude != null &&
                                        room.address.longitude != null && (
                                            <p className="mt-1 text-xs text-fg-muted">
                                                {room.address.latitude}, {room.address.longitude}
                                            </p>
                                        )}

                                    <a
                                        href={mapUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="mt-4 inline-flex items-center gap-2 rounded-xl border border-brand/20 bg-brand/5 px-4 py-2.5 text-sm font-semibold text-brand-text transition hover:bg-brand/10"
                                    >
                                        <MapPin size={16} />
                                        {t.actions.viewOnMap}
                                    </a>
                                </div>
                            </div>
                        </DetailSection>

                        <DetailSection
                            title={t.landlord.title}
                            description={t.landlord.description}
                        >
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                                <div className="flex size-14 shrink-0 items-center justify-center rounded-full border border-brand/20 bg-brand/10 text-lg font-bold text-brand-text">
                                    {(landlord.displayName || landlord.fullName)
                                        .split(' ')
                                        .slice(-2)
                                        .map((part) => part[0])
                                        .join('')
                                        .toUpperCase()}
                                </div>

                                <div className="min-w-0 flex-1">
                                    <p className="flex flex-wrap items-center gap-2 font-semibold text-fg">
                                        {landlord.displayName || landlord.fullName}

                                        {landlord.identityVerified && (
                                            <BadgeCheck
                                                size={17}
                                                className="text-brand-text"
                                            />
                                        )}
                                    </p>

                                    <p className="mt-1 text-sm text-fg-muted">
                                        {t.landlord.role}
                                    </p>

                                    {landlord.identityVerified && (
                                        <p className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium text-pos">
                                            <ShieldCheck size={14} />
                                            {t.landlord.identityVerified}
                                        </p>
                                    )}
                                </div>

                                <a
                                    href={`tel:${landlord.phone}`}
                                    className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-xl border border-line bg-surface-hover px-4 text-sm font-semibold text-fg transition hover:border-brand/30 hover:text-brand-text"
                                >
                                    {t.actions.contact}
                                </a>
                            </div>
                        </DetailSection>

                        <div className="flex items-start gap-3 rounded-panel border border-pos/20 bg-pos/5 p-4">
                            <ShieldCheck
                                size={20}
                                className="mt-0.5 shrink-0 text-pos"
                            />

                            <div>
                                <p className="text-sm font-semibold text-fg">
                                    {t.safety.title}
                                </p>
                                <p className="mt-1 text-xs leading-relaxed text-fg-2">
                                    {t.safety.description}
                                </p>
                            </div>
                        </div>
                    </div>

                    <aside className="order-first lg:order-last lg:sticky lg:top-24 lg:self-start">
                        <RoomContactPanel
                            item={item}
                            t={t.contactPanel}
                            lang={lang}
                            isSaved={isSaved}
                            onToggleSaved={() =>
                                setIsSaved((current) => !current)
                            }
                        />
                    </aside>
                </div>

                {relatedItems.length > 0 && (
                    <section className="mt-14 border-t border-line pt-10">
                        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
                            <div>
                                <span className="text-xs font-semibold uppercase tracking-wider text-brand-text">
                                    {t.related.eyebrow}
                                </span>

                                <h2 className="mt-2 text-2xl font-semibold tracking-tight text-fg">
                                    {t.related.title}
                                </h2>

                                <p className="mt-2 text-sm text-fg-muted">
                                    {t.related.description}
                                </p>
                            </div>

                            <Link
                                href={`/${lang}/rooms`}
                                className="text-sm font-semibold text-brand-text transition hover:text-brand-deep"
                            >
                                {t.related.viewAll} →
                            </Link>
                        </div>

                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                            {relatedItems.map((relatedItem) => (
                                <RelatedRoomCard
                                    key={relatedItem.room.id}
                                    item={relatedItem} lang={lang}
                                    t={t}
                                    enums={enums}
                                />
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </main>
    );
}