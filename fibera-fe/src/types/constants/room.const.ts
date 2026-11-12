import {
    Bed,
    BedDouble,
    BedSingle,
    Building2,
    DoorClosed,
    House,
    Users,
    type LucideIcon,
} from 'lucide-react';

import { ROOM_LAYOUTS, type RoomLayout } from '@/types/enums/room-layout.type';
import { ROOM_TYPES, type RoomType } from '@/types/enums/room.type';
import { PricePeriod } from '../enums/price-period.type';

export const ROOM_TYPE_CONFIG: Record<RoomType, { icon: LucideIcon; periods: readonly PricePeriod[] }> = {
    TRADITIONAL_ROOM: { icon: DoorClosed, periods: ['MONTH'] },
    MINI_APARTMENT: { icon: Building2, periods: ['MONTH'] },
    HOMESTAY: { icon: Bed, periods: ['DAY'] },
    WHOLE_HOUSE: { icon: House, periods: ['MONTH', 'DAY'] },
};

export const ROOM_LAYOUT_CONFIG: Record<RoomLayout, { icon: LucideIcon }> = {
    STUDIO: { icon: BedSingle },
    ONE_BEDROOM: { icon: BedDouble },
    TWO_BEDROOM: { icon: BedDouble },
    SHARED_ROOM: { icon: Users },
};

export { ROOM_LAYOUTS, ROOM_TYPES };