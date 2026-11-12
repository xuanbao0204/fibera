import {
    ArrowUpDown,
    Bath,
    BedDouble,
    Camera,
    CarFront,
    Clock,
    CookingPot,
    DoorOpen,
    Fingerprint,
    Flame,
    LampDesk,
    PawPrint,
    Refrigerator,
    ShieldAlert,
    Shirt,
    Sofa,
    Tv,
    WashingMachine,
    Wifi,
    Wind,
    type LucideIcon,
} from 'lucide-react';

import {
    AMENITY_CODES,
    AMENITY_GROUPS,
    type AmenityCode,
    type AmenityGroup,
} from '@/types/enums/amenity.type';

interface AmenityConfig {
    icon: LucideIcon;
    group: AmenityGroup;
}

/**
 * Record<AmenityCode, ...> => thêm code mới vào AMENITY_CODES
 * mà quên khai báo icon/group ở đây sẽ báo lỗi biên dịch.
 * Label (đa ngôn ngữ) nằm ở dictionary: enums.amenity[code].
 */
export const AMENITY_CONFIG: Record<AmenityCode, AmenityConfig> = {
    // comfort
    AIR_CONDITIONING: { icon: Wind, group: 'comfort' },
    WATER_HEATER: { icon: Flame, group: 'comfort' },
    BALCONY: { icon: DoorOpen, group: 'comfort' },

    // furniture
    BED: { icon: BedDouble, group: 'furniture' },
    WARDROBE: { icon: Shirt, group: 'furniture' },
    DESK: { icon: LampDesk, group: 'furniture' },
    SOFA: { icon: Sofa, group: 'furniture' },
    TV: { icon: Tv, group: 'furniture' },
    REFRIGERATOR: { icon: Refrigerator, group: 'furniture' },

    // utility
    WIFI: { icon: Wifi, group: 'utility' },
    PRIVATE_BATHROOM: { icon: Bath, group: 'utility' },
    KITCHEN: { icon: CookingPot, group: 'utility' },
    WASHING_MACHINE: { icon: WashingMachine, group: 'utility' },
    PARKING: { icon: CarFront, group: 'utility' },
    ELEVATOR: { icon: ArrowUpDown, group: 'utility' },

    // security
    CAMERA: { icon: Camera, group: 'security' },
    FINGERPRINT_LOCK: { icon: Fingerprint, group: 'security' },
    FIRE_SAFETY: { icon: ShieldAlert, group: 'security' },

    // policy
    FREE_HOURS: { icon: Clock, group: 'policy' },
    PET_FRIENDLY: { icon: PawPrint, group: 'policy' },
};

export type AmenityGroupEntry = {
    group: AmenityGroup;
    codes: AmenityCode[];
};

/** Dùng cho form đăng phòng và bộ lọc: danh sách code đã nhóm sẵn, giữ thứ tự khai báo. */
export const AMENITIES_BY_GROUP: AmenityGroupEntry[] = AMENITY_GROUPS.map(
    (group) => ({
        group,
        codes: AMENITY_CODES.filter(
            (code) => AMENITY_CONFIG[code].group === group,
        ),
    }),
);

export { AMENITY_CODES, AMENITY_GROUPS };
export type { AmenityCode, AmenityGroup };