import type { EnumMessages } from '@/i18n/dictionary.type';
import { pickHeadlinePromotion, PROMOTION_CONFIG } from '@/types/constants/promotion.const';
import type { Promotion } from '@/types/room/promotion.type';

interface PromotionBadgeProps {
    promotions: readonly Promotion[];
    rent: number;
    enums: EnumMessages;
    className?: string;
}

/** Nhãn ưu đãi nổi bật nhất, dùng trên card ở danh sách và phòng tương tự. */
export function PromotionBadge({
    promotions,
    rent,
    enums,
    className = '',
}: PromotionBadgeProps) {
    const headline = pickHeadlinePromotion(promotions, rent);

    if (!headline) return null;

    const Icon = PROMOTION_CONFIG[headline.code].icon;
    const extraCount = promotions.length - 1;

    return (
        <span
            className={`inline-flex items-center gap-1.5 rounded-lg bg-brand px-2.5 py-1 text-xs font-semibold text-brand-ink shadow-sm ${className}`}
        >
            <Icon size={12} className="shrink-0" />
            <span className="truncate">{enums.promotionCode[headline.code]}</span>
            {extraCount > 0 && <span className="opacity-80">+{extraCount}</span>}
        </span>
    );
}