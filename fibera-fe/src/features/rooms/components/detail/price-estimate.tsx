'use client';

import { useMemo, useState } from 'react';

import type { Locale } from '@/i18n/config';
import type { EnumMessages, RoomDetailMessage } from '@/i18n/dictionary.type';
import type { RoomPrice } from '@/types/room';
import type { Promotion } from '@/types/room/promotion.type';

import { formatPrice } from '../../constants/room-feed.constant';
import { formatMessage, plural } from '@/i18n/format';
import { calculatePayment } from '@/types/constants/promotion.calculator';
import { Dropdown } from '@/components/ui/DropDown';

const LEASE_OPTIONS = [3, 6, 12, 24] as const;
const DEFAULT_LEASE_MONTHS = 12;

interface PriceEstimateProps {
    price: RoomPrice;
    promotions: readonly Promotion[];
    lang: Locale;
    t: RoomDetailMessage;
    enums: EnumMessages;
}

function EstimateRow({
    label,
    value,
    original,
    strong = false,
}: {
    label: string;
    value: string;
    original?: string;
    strong?: boolean;
}) {
    return (
        <div className="flex items-center justify-between gap-4">
            <span className={strong ? 'text-sm font-semibold text-fg' : 'text-sm text-fg-2'}>
                {label}
            </span>

            <span className="text-right">
                {original && original !== value && (
                    <span className="mr-2 text-xs text-fg-muted line-through">
                        {original}
                    </span>
                )}
                <span
                    className={
                        strong
                            ? 'text-lg font-bold text-brand-text'
                            : 'text-sm font-semibold text-fg'
                    }
                >
                    {value}
                </span>
            </span>
        </div>
    );
}

export function PriceEstimate({
    price,
    promotions,
    lang,
    t,
    enums,
}: PriceEstimateProps) {
    const e = t.pricing.estimate;

    const [leaseMonths, setLeaseMonths] = useState<number>(DEFAULT_LEASE_MONTHS);
    const [isStudent, setIsStudent] = useState(false);

    const hasStudentPromotion = promotions.some(
        (promotion) => promotion.conditions.requiresStudentProof,
    );

    const estimate = useMemo(
        () => calculatePayment(price, promotions, { leaseMonths, isStudent }),
        [price, promotions, leaseMonths, isStudent],
    );

    if (promotions.length === 0) return null;

    const money = (value: number) => formatPrice(value, lang);
    const showOngoing =
        estimate.ongoingFromMonth !== null &&
        estimate.ongoingRent !== estimate.firstMonthRent;

    return (
        <div className="mt-4 rounded-xl border border-brand/30 bg-brand/5 p-4">
            <h3 className="text-sm font-semibold text-fg">{e.title}</h3>
            <p className="mt-1 text-xs text-fg-muted">{e.description}</p>

            <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-3">
                <label className="flex items-center gap-2 text-sm text-fg-2">
                    {e.leaseMonths}

                    <Dropdown
                        value={String(leaseMonths)}
                        onChange={(value) => setLeaseMonths(Number(value))}
                    >
                        <Dropdown.Trigger className="w-28">
                            {plural(lang, e.months, leaseMonths)}
                        </Dropdown.Trigger>

                        <Dropdown.Content>
                            {LEASE_OPTIONS.map((months) => (
                                <Dropdown.Item
                                    key={months}
                                    value={String(months)}
                                >
                                    {plural(lang, e.months, months)}
                                </Dropdown.Item>
                            ))}
                        </Dropdown.Content>
                    </Dropdown>
                </label>

                {hasStudentPromotion && (
                    <label className="flex cursor-pointer items-center gap-2 text-sm text-fg-2">
                        <input
                            type="checkbox"
                            checked={isStudent}
                            onChange={(event) => setIsStudent(event.target.checked)}
                            className="size-4 rounded accent-brand"
                        />
                        {e.student}
                    </label>
                )}
            </div>

            <div className="mt-4 space-y-3 border-t border-line pt-4">
                <EstimateRow
                    label={e.firstMonthRent}
                    value={money(estimate.firstMonthRent)}
                    original={money(estimate.rent)}
                />

                <EstimateRow
                    label={e.deposit}
                    value={money(estimate.deposit)}
                    original={money(estimate.depositOriginal)}
                />

                <div className="border-t border-line pt-3">
                    <EstimateRow
                        strong
                        label={e.moveInTotal}
                        value={money(estimate.moveInTotal)}
                        original={money(estimate.moveInTotalOriginal)}
                    />
                </div>

                {showOngoing && estimate.ongoingFromMonth !== null && (
                    <EstimateRow
                        label={formatMessage(e.ongoingRent, {
                            month: estimate.ongoingFromMonth,
                        })}
                        value={`${money(estimate.ongoingRent)} ${t.pricing.period[price.period]}`}
                    />
                )}

                {estimate.leaseSavings > 0 && (
                    <p className="text-xs font-medium text-brand-text">
                        {plural(lang, e.totalSavings, leaseMonths)}:{' '}
                        {money(estimate.leaseSavings)}
                    </p>
                )}

                {estimate.skipped.length > 0 && (
                    <p className="text-xs text-fg-muted">
                        {formatMessage(e.notApplied, {
                            names: estimate.skipped
                                .map(({ promotion }) => enums.promotionCode[promotion.code])
                                .join(', '),
                        })}
                    </p>
                )}
            </div>

            <p className="mt-4 text-xs leading-relaxed text-fg-muted">{e.note}</p>
        </div>
    );
}