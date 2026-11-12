import type { Locale } from '@/i18n/config';
import type { EnumMessages, RoomDetailMessage } from '@/i18n/dictionary.type';
import type { Promotion } from '@/types/room/promotion.type';

import { PROMOTION_CONFIG } from '@/types/constants/promotion.const';
import { describeBenefit, describeConditions, describeValidity } from '@/types/constants/promotion-text';

interface PromotionListProps {
    promotions: readonly Promotion[];
    lang: Locale;
    t: RoomDetailMessage;
    enums: EnumMessages;
}

/** Nội dung của section "Ưu đãi đang áp dụng" (bọc trong DetailSection ở trang chi tiết). */
export function PromotionList({ promotions, lang, t, enums }: PromotionListProps) {
    return (
        <ul className="space-y-3">
            {promotions.map((promotion) => {
                const Icon = PROMOTION_CONFIG[promotion.code].icon;
                const conditions = describeConditions(promotion, t.promotion, lang);

                return (
                    <li
                        key={promotion.id}
                        className="flex gap-4 rounded-xl border border-brand/20 bg-brand/5 p-4"
                    >
                        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-brand text-brand-ink">
                            <Icon size={18} />
                        </div>

                        <div className="min-w-0 flex-1">
                            <p className="text-sm font-semibold text-fg">
                                {enums.promotionCode[promotion.code]}
                            </p>

                            <p className="mt-1 text-sm font-medium text-brand-text">
                                {describeBenefit(promotion.benefit, t.promotion, lang)}
                            </p>

                            {conditions.length > 0 && (
                                <ul className="mt-2 flex flex-wrap gap-2">
                                    {conditions.map((condition) => (
                                        <li
                                            key={condition}
                                            className="rounded-md border border-line bg-surface px-2 py-1 text-xs text-fg-muted"
                                        >
                                            {condition}
                                        </li>
                                    ))}
                                </ul>
                            )}

                            <p className="mt-2 text-xs text-fg-muted">
                                {describeValidity(promotion, t.promotion, lang)}
                            </p>
                        </div>
                    </li>
                );
            })}
        </ul>
    );
}