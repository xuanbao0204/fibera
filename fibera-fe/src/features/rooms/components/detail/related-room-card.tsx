import Link from 'next/link';

import {
    BadgeCheck,
    MapPin,
    Ruler,
} from 'lucide-react';

import type { RoomFeedItem } from '../../types/room-feed.type';

import {
    formatCompactPrice,
} from '../../constants/room-feed.constant';
import { Locale } from '@/i18n/config';
import { EnumMessages, RoomDetailMessage } from '@/i18n/dictionary.type';
import { PromotionBadge } from '../promotion/promotion-badge';

interface RelatedRoomCardProps {
    item: RoomFeedItem;
    lang: Locale;
    t: RoomDetailMessage;
    enums: EnumMessages;
}

export function RelatedRoomCard({
    item,
    lang,
    t,
    enums,
}: RelatedRoomCardProps) {
    const { room, price, media, promotions } = item;

    const cover =
        media.find((image) => image.isCover)?.url ??
        media.find((image) => image.type === 'IMAGE')?.url;

    const location = [
        room.address.ward,
        room.address.district,
        room.address.city,
    ]
        .filter(Boolean)
        .join(', ');

    return (
        <article className="group overflow-hidden rounded-panel border border-line bg-surface transition hover:-translate-y-1 hover:border-brand/30 hover:shadow-panel">
            <Link
                href={`/${lang}/rooms/${room.id}`}
                className="block"
            >
                <div className="relative aspect-4/3 overflow-hidden bg-surface-hover">
                    {cover && (
                        <div
                            className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                            style={{
                                backgroundImage: `url("${cover}")`,
                            }}
                        />
                    )}

                    <span className="absolute left-3 top-3 rounded-lg border border-line bg-bg/90 px-2.5 py-1 text-xs font-semibold text-fg backdrop-blur">
                        {enums.roomType[room.category]}
                    </span>

                    <PromotionBadge
                        promotions={promotions}
                        rent={price.rent}
                        enums={enums}
                        className="absolute bottom-3 left-3 max-w-[calc(100%-1.5rem)]"
                    />

                    {room.verification === 'APPROVED' && (
                        <span className="absolute right-3 top-3 flex size-8 items-center justify-center rounded-full bg-brand text-brand-ink shadow-sm">
                            <BadgeCheck size={16} />
                        </span>
                    )}
                </div>

                <div className="p-4">
                    <h3 className="line-clamp-2 min-h-11 text-sm font-semibold leading-relaxed text-fg transition group-hover:text-brand-text">
                        {room.title}
                    </h3>

                    <div className="mt-3 flex items-center gap-2 text-xs text-fg-muted">
                        <MapPin size={14} className="shrink-0 text-brand-text" />
                        <span className="truncate">{location}</span>
                    </div>

                    <div className="mt-2 flex items-center gap-2 text-xs text-fg-muted">
                        <Ruler size={14} className="text-brand-text" />
                        {room.areaM2} m²
                    </div>

                    <div className="mt-4 border-t border-line pt-3">
                        <p className="text-lg font-bold text-brand-text">
                            {formatCompactPrice(price.rent, lang)}
                            <span className="ml-1 text-xs font-medium text-fg-muted">
                                {t.pricing.perMonth}
                            </span>
                        </p>
                    </div>
                </div>
            </Link>
        </article>
    );
}