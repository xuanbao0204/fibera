export const AMENITY_CODES = [
    // comfort
    'AIR_CONDITIONING',
    'WATER_HEATER',
    'BALCONY',
    // furniture
    'BED',
    'WARDROBE',
    'DESK',
    'SOFA',
    'TV',
    'REFRIGERATOR',
    // utility
    'WIFI',
    'PRIVATE_BATHROOM',
    'KITCHEN',
    'WASHING_MACHINE',
    'PARKING',
    'ELEVATOR',
    // security
    'CAMERA',
    'FINGERPRINT_LOCK',
    'FIRE_SAFETY',
    // policy
    'FREE_HOURS',
    'PET_FRIENDLY',
] as const;

export type AmenityCode = (typeof AMENITY_CODES)[number];

export const AMENITY_GROUPS = [
    'comfort',
    'furniture',
    'utility',
    'security',
    'policy',
] as const;

export type AmenityGroup = (typeof AMENITY_GROUPS)[number];

const AMENITY_CODE_SET: ReadonlySet<string> = new Set(AMENITY_CODES);

export function isAmenityCode(value: string): value is AmenityCode {
    return AMENITY_CODE_SET.has(value);
}

export function sanitizeAmenityCodes(values: readonly string[]): AmenityCode[] {
    return values.filter(isAmenityCode);
}