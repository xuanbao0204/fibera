import type { RoomType } from '@/types/enums/room.type';
import type { RoomLayout } from '@/types/enums/room-layout.type';
import type { Landlord } from '@/types/landlord.type';
import type { ListingPost } from '@/types/post/listing-post.type';
import type {
    Amenity,
    Room,
    RoomMedia,
    RoomPrice,
} from '@/types/room';
import { AmenityCode } from '@/types/enums/amenity.type';
import { Promotion } from '@/types/room/promotion.type';

export interface RoomFeedItem {
    post: ListingPost;
    room: Room;
    price: RoomPrice;
    media: RoomMedia[];
    landlord: Landlord;
    promotions: Promotion[];
}

export type RoomFeedSort =
    | 'recommended'
    | 'newest'
    | 'price-asc'
    | 'price-desc'
    | 'area-desc';

export interface RoomFeedFilters {
    city: string;
    district: string;
    roomType: 'ALL' | RoomType;
    layout: 'ALL' | RoomLayout;
    minPrice: string;
    maxPrice: string;
    minArea: string;
    maxArea: string;
    amenityCodes: AmenityCode[];
    furnishedOnly: boolean;
    verifiedOnly: boolean;
}