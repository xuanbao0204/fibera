import { BaseEntity } from "../base-entity";
import { SlotStatus } from "./type";

export interface RoomSlot extends BaseEntity {
    roomId: string;
    label: string;
    status: SlotStatus;
}