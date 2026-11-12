import { BaseEntity } from '../base-entity';
import { ModerationTargetType, ModerationVerdict, ViolationCategory } from './type';

export interface ModerationResult extends BaseEntity {
  targetType: ModerationTargetType;
  targetId: string;

  verdict: ModerationVerdict;
  categories: ViolationCategory[];

  confidence: number;
  explanation: string;

  modelName: string;
  modelVersion: string;
}