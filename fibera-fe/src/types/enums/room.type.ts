export const ROOM_TYPES = [
    'TRADITIONAL_ROOM',
    'MINI_APARTMENT',
    'HOMESTAY',
    'WHOLE_HOUSE',
] as const;

export type RoomType = (typeof ROOM_TYPES)[number];

const ROOM_TYPE_SET: ReadonlySet<string> = new Set(ROOM_TYPES);

export const isRoomType = (value: string): value is RoomType =>
    ROOM_TYPE_SET.has(value);