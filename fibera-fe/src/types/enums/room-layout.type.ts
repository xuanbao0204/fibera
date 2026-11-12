export const ROOM_LAYOUTS = [
    'STUDIO',
    'ONE_BEDROOM',
    'TWO_BEDROOM',
    'SHARED_ROOM',
] as const;

export type RoomLayout = (typeof ROOM_LAYOUTS)[number];

const ROOM_LAYOUT_SET: ReadonlySet<string> = new Set(ROOM_LAYOUTS);

export const isRoomLayout = (value: string): value is RoomLayout =>
    ROOM_LAYOUT_SET.has(value);