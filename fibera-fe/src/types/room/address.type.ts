export interface Address {
    street: string;
    ward: string;
    district: string;
    city: string;

    latitude?: number | null;
    longitude?: number | null;
}