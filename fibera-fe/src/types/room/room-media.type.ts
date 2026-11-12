import { BaseEntity } from "../base-entity";
import { MediaType } from "./type";

export interface RoomMedia extends BaseEntity {
    roomId: string;

    type: MediaType;
    url: string;

    sortOrder: number;
    isCover: boolean;
}