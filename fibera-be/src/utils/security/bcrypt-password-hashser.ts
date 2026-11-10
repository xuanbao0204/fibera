import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import bcrypt from 'bcrypt';
import { PasswordHasher } from './password-hasher.js';

@Injectable()
export class BcryptPasswordHasher extends PasswordHasher {
    private readonly rounds: number;

    constructor(config: ConfigService) {
        super();
        this.rounds = Number(config.get<string>('BCRYPT_ROUNDS') ?? 12);
    }

    hash(plain: string): Promise<string> {
        return bcrypt.hash(plain, this.rounds);
    }

    verify(plain: string, hashed: string): Promise<boolean> {
        return bcrypt.compare(plain, hashed);
    }
}