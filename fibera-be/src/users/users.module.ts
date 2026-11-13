import { Module } from '@nestjs/common';
import { UsersRepository } from './repositories/users.repository.js';
import { InMemoryUsersRepository } from './repositories/in-memory-users.repository.js';
import { UsersService } from './users.service.js';
import { DrizzleUsersRepository } from './repositories/drizzle-users.repository.js';

@Module({
    providers: [{
        provide: UsersRepository,
        useClass: DrizzleUsersRepository,
    }, UsersService],
    exports: [UsersService],
})
export class UsersModule {}
