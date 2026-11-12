export type RoomStatus =
    | 'DRAFT'
    | 'PUBLISHED'
    | 'HIDDEN'
    | 'RENTED'
    | 'INACTIVE';

export type VerificationStatus =
    | 'PENDING'
    | 'APPROVED'
    | 'REJECTED';

export type SlotStatus =
    | 'AVAILABLE'
    | 'OCCUPIED'
    | 'RESERVED'
    | 'UNAVAILABLE';

export type MediaType =
    | 'IMAGE'
    | 'VIDEO';