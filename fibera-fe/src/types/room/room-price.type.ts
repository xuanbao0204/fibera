import { BaseEntity } from "../base-entity";
import { PricePeriod } from "../enums/price-period.type";

export interface RoomPrice extends BaseEntity {
    roomId: string;

    rent: number;
    period: PricePeriod;
    deposit: number;

    electricityRate: number;
    waterRate: number;
    serviceFee: number;

    effectiveFrom: string;
}