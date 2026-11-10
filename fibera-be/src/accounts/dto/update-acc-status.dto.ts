import { IsEnum } from 'class-validator';
import { AccountStatus } from '../domain/index.js';

export class UpdateAccountStatusDto {
    @IsEnum(AccountStatus)
    status!: AccountStatus;
}