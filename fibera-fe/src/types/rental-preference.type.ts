import { RoomLayout } from "./enums/room-layout.type";
import { RoomType } from "./enums/room.type";

export interface RentalPreference {
    budgetMin?: number | null;
    budgetMax?: number | null;

    preferredAreas: string[];

    category?: RoomType | null;
    layout?: RoomLayout | null;

    amenityCodes: string[];
}