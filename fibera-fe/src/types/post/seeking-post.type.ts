import { RoomType } from "../enums/room.type";
import { Post } from "./post.types";

export interface SeekingPost extends Post {
    budgetMin?: number | null;
    budgetMax?: number | null;

    preferredAreas: string[];

    category?: RoomType | null;
    moveInDate?: string | null;
}