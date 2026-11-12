import {
    BadgeCheck,
    CalendarDays,
    CheckCircle2,
    Phone,
    ShieldCheck,
    UserRound,
} from 'lucide-react';

import type { RoomFeedItem } from '../../types/room-feed.type';

import {
    formatCompactPrice,
    formatPrice,
} from '../../constants/room-feed.constant';
import { RoomDetailMessage } from '@/i18n/dictionary.type';
import { Locale } from '@/i18n/config';

interface RoomContactPanelProps {
    item: RoomFeedItem;
    t: RoomDetailMessage['contactPanel'];
    lang: Locale;
    isSaved: boolean;
    onToggleSaved: () => void;
}

export function RoomContactPanel({
    item,
    t,
    lang,
    isSaved,
    onToggleSaved,
}: RoomContactPanelProps) {
    const { room, price, landlord } = item;

    const landlordName =
        landlord.displayName || landlord.fullName;

    const initials = landlordName
        .split(' ')
        .slice(-2)
        .map((part) => part[0])
        .join('')
        .toUpperCase();

    return (
        <div className="space-y-4 lg:sticky lg:top-24">
            <section className="overflow-hidden rounded-card border border-line bg-surface shadow-panel">
                <div className="border-b border-line bg-linear-to-br from-brand/10 via-brand/5 to-transparent p-5">
                    <p className="text-xs font-medium uppercase tracking-wider text-fg-muted">
                        {t.price.title}
                    </p>

                    <div className="mt-2 flex flex-wrap items-baseline gap-1.5">
                        <span className="text-3xl font-bold tracking-tight text-brand-text">
                            {formatCompactPrice(price.rent, lang)}
                        </span>
                        <span className="text-sm text-fg-muted">
                            {t.price.period[price.period]}
                        </span>
                    </div>

                    <p className="mt-2 text-xs text-fg-muted">
                        {t.price.deposit} {formatPrice(price.deposit, lang)}
                    </p>
                </div>

                <div className="space-y-4 p-5">
                    <div className="flex items-center gap-3">
                        <div className="flex size-12 shrink-0 items-center justify-center rounded-full border border-brand/15 bg-brand/10 text-sm font-bold text-brand-text">
                            {initials}
                        </div>

                        <div className="min-w-0 flex-1">
                            <p className="flex flex-wrap items-center gap-1.5 font-semibold text-fg">
                                {landlordName}
                                {landlord.identityVerified && (
                                    <BadgeCheck
                                        size={16}
                                        className="shrink-0 text-brand-text"
                                    />
                                )}
                            </p>

                            <p className="mt-0.5 text-xs text-fg-muted">
                                {t.landlord.role}
                            </p>
                        </div>
                    </div>

                    {landlord.identityVerified && (
                        <div className="flex items-center gap-2 rounded-xl border border-pos/20 bg-pos/5 p-3">
                            <ShieldCheck
                                size={18}
                                className="shrink-0 text-pos"
                            />
                            <p className="text-xs leading-relaxed text-fg-2">
                                
                                {t.landlord.verifiedMessage}
                            </p>
                        </div>
                    )}

                    <div className="space-y-2 border-y border-line py-4">
                        <div className="flex items-center justify-between gap-3">
                            <span className="text-sm text-fg-muted">
                                {t.details.area}
                            </span>
                            <span className="text-sm font-semibold text-fg">
                                {room.areaM2} m²
                            </span>
                        </div>

                        <div className="flex items-center justify-between gap-3">
                            <span className="text-sm text-fg-muted">
                                {t.details.capacity}
                            </span>
                            <span className="text-sm font-semibold text-fg">
                                {room.maxOccupants} {t.details.person}
                            </span>
                        </div>

                        <div className="flex items-center justify-between gap-3">
                            <span className="text-sm text-fg-muted">
                                {t.details.furnished}
                            </span>
                            <span className="text-sm font-semibold text-fg">
                                {room.furnished ? t.details.fullyFurnished : t.details.basicFurnished}
                            </span>
                        </div>
                    </div>

                    <a
                        href={`tel:${landlord.phone}`}
                        className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-brand px-4 text-sm font-semibold text-brand-ink transition hover:bg-brand-deep hover:shadow-glow"
                    >
                        <Phone size={17} />
                        {t.actions.call.replace('{phone}', landlord.phone)}
                    </a>

                    <button
                        type="button"
                        onClick={onToggleSaved}
                        aria-pressed={isSaved}
                        className={`flex h-11 w-full items-center justify-center gap-2 rounded-xl border text-sm font-semibold transition ${isSaved
                                ? 'border-neg/20 bg-neg/10 text-neg'
                                : 'border-line bg-surface-hover text-fg-2 hover:border-brand/40 hover:text-brand-text'
                            }`}
                    >
                        <UserRound size={17} />
                        {isSaved ? t.actions.saved : t.actions.save}
                    </button>

                    <div className="flex items-start gap-2 pt-1 text-xs leading-relaxed text-fg-muted">
                        <CheckCircle2
                            size={15}
                            className="mt-0.5 shrink-0 text-brand-text"
                        />
                        <span>
                            {t.notice.description}
                        </span>
                    </div>
                </div>
            </section>

            <section className="rounded-panel border border-line bg-surface p-4">
                <div className="flex items-start gap-3">
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-brand/10 text-brand-text">
                        <CalendarDays size={17} />
                    </div>

                    <div>
                        <p className="text-sm font-semibold text-fg">
                            {t.schedule.title}
                        </p>
                        <p className="mt-1 text-xs leading-relaxed text-fg-muted">
                            {t.schedule.description}
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
}
