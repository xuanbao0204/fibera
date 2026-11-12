import { BaseEntity } from "../base-entity";

export interface Amenity extends BaseEntity {
    code: string;
    name: string;
    icon?: string | null;
}