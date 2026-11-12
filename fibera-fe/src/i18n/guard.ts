import vi from './dicts/vi.json';
import en from './dicts/en.json';
import type { Locale } from './config';
import type { RoomType, RoomLayout } from '@/types';
import type { RoomFeedSort } from '@/features/rooms/types/room-feed.type';
import type { Dictionary } from './dictionary.type';

export const localesMatchVi = { vi, en } satisfies Record<Locale, Dictionary>; // en thiếu key là lỗi build
export const roomTypeLabels = vi.enums.roomType satisfies Record<RoomType, string>;
export const roomLayoutLabels = vi.enums.roomLayout satisfies Record<RoomLayout, string>;
export const sortLabels = vi['room-feed'].sort satisfies Record<RoomFeedSort, string>;