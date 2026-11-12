import { BaseEntity } from '../base-entity';
import { AmenityCode } from '../enums/amenity.type';
import { RoomLayout } from '../enums/room-layout.type';
import { RoomType } from '../enums/room.type';
import type { Address } from './address.type';
import type { RoomStatus, VerificationStatus } from './type';

export interface Room extends BaseEntity {
  landlordId: string;

  title: string;
  description: string;

  category: RoomType;
  layout: RoomLayout;

  areaM2: number;
  maxOccupants: number;
  furnished: boolean;

  address: Address;
  amenityCodes: AmenityCode[];

  status: RoomStatus;
  verification: VerificationStatus;
}