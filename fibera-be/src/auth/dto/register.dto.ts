import { Transform } from 'class-transformer';
import {
    IsEmail,
    IsIn,
    IsNotEmpty,
    IsString,
    Matches,
    MaxLength,
    MinLength,
} from 'class-validator';
import {
    PUBLIC_REGISTER_ROLES,
    Role,
} from '../../common/constants/role.enum.js';
import {
    emailTransform,
    phoneTransform,
    trimTransform,
    VN_PHONE_REGEX,
} from '../../common/utils/normalize.util.js';

const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d)[\x21-\x7E]+$/;

export class RegisterDto {
    @Transform(emailTransform)
    @IsEmail()
    @MaxLength(254)
    email!: string;

    @IsString()
    @MinLength(8)
    @MaxLength(64)
    @Matches(PASSWORD_REGEX)
    password!: string;

    @Transform(trimTransform)
    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    fullName!: string;

    @Transform(phoneTransform)
    @Matches(VN_PHONE_REGEX)
    phone!: string;

    @IsIn(PUBLIC_REGISTER_ROLES)
    role!: Role;
}