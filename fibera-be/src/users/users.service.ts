import { HttpStatus, Injectable } from '@nestjs/common';
import { Role } from '../common/constants/role.enum.js';
import { UserOf } from './domain/user.type.js';
import { UsersRepository } from './repositories/users.repository.js';
import { ApiException } from '../common/exceptions/api.exception.js';
import { ErrorCode } from '../common/constants/error-code.enum.js';

export type NewUser<R extends Role> = Omit<UserOf<R>, "id" | "createdAt" | "updatedAt">;

@Injectable()
export class UsersService {
    constructor(private readonly users: UsersRepository) { }

    /**
     * Creates a new user with the specified role and data.
     * @param role 
     * @param data 
     * @returns 
     */
    create<R extends Role>(role: R, data: NewUser<R>): Promise<UserOf<R>> {
        const now = new Date();
        const user = {
            ...data,
            id: crypto.randomUUID(),
            createdAt: now,
            updatedAt: now,
        } as UserOf<R>;
        return this.users.create(role, user);
    }

    /**
     * Gets a user by their ID and role. Throws an ApiException if the user is not found.
     * @param role 
     * @param id 
     * @returns 
     */
    async getById<R extends Role>(role: R, id: string): Promise<UserOf<R>> {
        const user = await this.users.findById(role, id);
        if (!user) {
            throw new ApiException(
                HttpStatus.NOT_FOUND,
                ErrorCode.USER_NOT_FOUND,
                "User not found"
            );
        }
        return user;
    }

    remove(role: Role, id: string): Promise<void> {
        return this.users.delete(role, id);
    }
}