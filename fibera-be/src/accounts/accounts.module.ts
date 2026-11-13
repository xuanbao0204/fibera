import { Module } from '@nestjs/common';
import { InMemoryAccountsRepository } from './repositories/in-memory-accounts.repository.js';
import { AccountsRepository } from './repositories/accounts.repository.js';
import { BcryptPasswordHasher } from '../utils/security/bcrypt-password-hashser.js';
import { PasswordHasher } from '../utils/security/password-hasher.js';
import { AccountsService } from './accounts.service.js';
import { AccountsController } from './accounts.controller.js';
import { DrizzleAccountsRepository } from './repositories/drizzle-accounts.repository.js';

@Module({
    providers: [
        { provide: AccountsRepository, useClass: DrizzleAccountsRepository,},
        { provide: PasswordHasher, useClass: BcryptPasswordHasher },
        AccountsService,
    ],
    exports: [AccountsService],
    controllers: [AccountsController],
})
export class AccountsModule { }
