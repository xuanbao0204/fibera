import { Post } from "./post.types";

export interface ListingPost extends Post {
    roomId: string;
    expiresAt?: string | null;
}