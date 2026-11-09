import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { emailTransform } from '../../common/utils/normalize.util.js';

export class LoginDto {
    @Transform(emailTransform)
    @IsEmail()
    email!: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(128)
    password!: string;
}