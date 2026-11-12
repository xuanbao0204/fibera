
'use client';

import Link from 'next/link';

import {
    BadgeCheck,
    BedDouble,
    Heart,
    MapPin,
    Ruler,
    Users,
} from 'lucide-react';

import type { RoomFeedItem } from '../types/room-feed.type';

import {
    formatCompactPrice,
    formatPrice,
} from '../constants/room-feed.constant';
import { CommonMessage, EnumMessages, RoomFeedMessage } from '@/i18n/dictionary.type';
import { Locale } from '@/i18n/config';
import { RoomLayout, RoomType } from '@/types';
import { AMENITY_CONFIG } from '@/types/constants/amenity.const';
import { PromotionBadge } from './promotion/promotion-badge';

interface RoomListingCardProps {
    item: RoomFeedItem;
    t: RoomFeedMessage;
    lang: Locale;
    common: CommonMessage;
    enums: EnumMessages;
    isSaved: boolean;
    onToggleSaved: (roomId: string) => void;
}

export function RoomListingCard({
    item,
    t,
    lang,
    common,
    enums,
    isSaved,
    onToggleSaved,
}: RoomListingCardProps) {
    const { room, price, media, landlord, promotions } = item;
    const amenities = room.amenityCodes;

    const cover =
        media.find((image) => image.isCover)?.url ??
        media[0]?.url;

    const location = [
        room.address.street,
        room.address.ward,
        room.address.district,
        room.address.city,
    ]
        .filter(Boolean)
        .join(', ');

    const landlordName =
        landlord.displayName || landlord.fullName;

    const landlordInitials = landlordName
        .split(' ')
        .slice(-2)
        .map((part) => part[0])
        .join('')
        .toUpperCase();

    return (
        <article className="group overflow-hidden rounded-card border border-line bg-surface transition-all duration-300 hover:-translate-y-1 hover:border-brand/30 hover:shadow-panel">
            <div className="flex flex-col md:flex-row">
                <div className="relative min-h-55 overflow-hidden md:min-h-70 md:w-[36%] md:shrink-0">
                    <div
                        role="img"
                        aria-label={room.title}
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                        style={{
                            backgroundImage: cover
                                ? `url("${cover}")`
                                : undefined,
                        }}
                    />

                    <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent" />

                    <div className="absolute left-4 top-4 flex flex-wrap gap-2">
                        <span className="rounded-lg border border-line bg-bg/90 px-3 py-1.5 text-xs font-semibold text-fg shadow-sm backdrop-blur">
                            {enums.roomType[room.category]}
                        </span>

                        {room.verification === 'APPROVED' && (
                            <span className="flex items-center gap-1 rounded-lg bg-brand px-2.5 py-1.5 text-xs font-semibold text-brand-ink shadow-sm">
                                <BadgeCheck size={13} />
                                {common.terms.verifiedRoom}
                            </span>
                        )}
                    </div>

                    <button
                        type="button"
                        onClick={() => onToggleSaved(room.id)}
                        aria-label={isSaved ? t.card.saved.unsave : t.card.saved.save}
                        aria-pressed={isSaved}
                        className={`absolute right-4 top-4 flex size-10 items-center justify-center rounded-full border shadow-sm backdrop-blur transition ${isSaved
                            ? 'border-neg/20 bg-neg text-white'
                            : 'border-white/30 bg-bg/90 text-fg hover:border-neg/30 hover:text-neg'
                            }`}
                    >
                        <Heart
                            size={19}
                            fill={isSaved ? 'currentColor' : 'none'}
                        />
                    </button>

                    <div className='absolute flex flex-col justify-center items-start gap-2 w-full bottom-4 left-4'>
                        <PromotionBadge
                            promotions={promotions}
                            rent={price.rent}
                            enums={enums}
                            className="max-w-[calc(100%-1.5rem)]"
                        />

                        <span className="rounded-lg bg-black/45 px-2.5 py-1 text-xs font-medium text-white backdrop-blur">
                            {room.status === 'PUBLISHED'
                                ? t.card.status.published
                                : t.card.status.unpublished}
                        </span>

                    </div>

                </div>

                <div className="flex min-w-0 flex-1 flex-col p-5 md:p-6">
                    <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-semibold uppercase tracking-wide text-brand-text">
                            {enums.roomLayout[room.layout]}
                        </span>

                        <span className="size-1 rounded-full bg-fg-muted/50" />

                        <span className="text-xs text-fg-muted">
                            {room.furnished
                                ? t.card.furnished.fully
                                : t.card.furnished.basic}
                        </span>
                    </div>

                    <Link
                        href={`/${lang}/rooms/${room.id}`}
                        className="mt-2 line-clamp-2 text-lg font-semibold leading-snug tracking-tight text-fg transition hover:text-brand-text md:text-xl"
                    >
                        {room.title}
                    </Link>

                    <div className="mt-3 flex items-start gap-2 text-sm text-fg-2">
                        <MapPin
                            size={16}
                            className="mt-0.5 shrink-0 text-brand-text"
                        />
                        <span className="line-clamp-2">{location}</span>
                    </div>

                    <div className="mt-4 grid grid-cols-3 gap-2 border-y border-line py-4">
                        <div className="flex items-center gap-2">
                            <Ruler
                                size={17}
                                className="shrink-0 text-brand-text"
                            />
                            <div className="min-w-0">
                                <p className="text-xs text-fg-muted">
                                    {common.terms.area}
                                </p>
                                <p className="text-sm font-semibold text-fg">
                                    {room.areaM2} m²
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <Users
                                size={17}
                                className="shrink-0 text-brand-text"
                            />
                            <div className="min-w-0">
                                <p className="text-xs text-fg-muted">
                                    {t.card.details.capacity}
                                </p>
                                <p className="text-sm font-semibold text-fg">
                                    {room.maxOccupants} {t.card.details.person}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <BedDouble
                                size={17}
                                className="shrink-0 text-brand-text"
                            />
                            <div className="min-w-0">
                                <p className="text-xs text-fg-muted">
                                    {common.terms.layout}
                                </p>
                                <p className="truncate text-sm font-semibold text-fg">
                                    {enums.roomLayout[room.layout]}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                        {amenities.slice(0, 4).map((amenity) => {
                            const Icon = AMENITY_CONFIG[amenity].group

                            return (
                                <span
                                    key={amenity}
                                    className="rounded-lg border border-line bg-surface-hover px-2.5 py-1.5 text-xs font-medium text-fg-2"
                                >
                                    {enums.amenity[amenity]}
                                </span>
                            )
                        })}

                        {amenities.length > 4 && (
                            <span className="rounded-lg border border-line bg-surface-hover px-2.5 py-1.5 text-xs font-medium text-fg-muted">
                                +{amenities.length - 4}
                            </span>
                        )}
                    </div>

                    <div className="mt-auto flex flex-col gap-4 pt-5 sm:flex-row sm:items-end sm:justify-between">
                        <div className="flex items-center gap-2.5">
                            <div className="flex size-9 shrink-0 items-center justify-center rounded-full border border-brand/15 bg-brand/10 text-xs font-bold text-brand-text">
                                {landlordInitials}
                            </div>

                            <div>
                                <p className="flex items-center gap-1 text-sm font-semibold text-fg">
                                    {landlordName}
                                    {landlord.identityVerified && (
                                        <BadgeCheck
                                            size={14}
                                            className="text-brand-text"
                                        />
                                    )}
                                </p>
                                <p className="text-xs text-fg-muted">
                                    {t.card.landlord.label}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-end justify-between gap-4 sm:flex-col sm:items-end sm:gap-2">
                            <div className="sm:text-right">
                                <p className="text-xl font-bold tracking-tight text-brand-text">
                                    {formatCompactPrice(price.rent, lang)}
                                    <span className="ml-1 text-xs font-medium text-fg-muted">
                                        {t.card.price.period[price.period]}
                                    </span>
                                </p>
                                <p className="text-xs text-fg-muted">
                                    {t.card.price.deposit} {formatCompactPrice(price.deposit, lang)}
                                </p>
                            </div>

                            <Link
                                href={`/${lang}/rooms/${room.id}`}
                                className="inline-flex shrink-0 items-center justify-center rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-brand-ink shadow-sm transition hover:bg-brand-deep hover:shadow-glow"
                            >
                                {common.actions.viewDetails}
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </article>
    );
}
