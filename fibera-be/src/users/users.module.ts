import { Module } from '@nestjs/common';
import { UsersRepository } from './repositories/users.repository.js';
import { InMemoryUsersRepository } from './repositories/in-memory-users.repository.js';
import { UsersService } from './users.service.js';

@Module({
    providers: [{
        provide: UsersRepository,
        useClass: InMemoryUsersRepository,
    }, UsersService],
    exports: [UsersService],
})
export class UsersModule {}
