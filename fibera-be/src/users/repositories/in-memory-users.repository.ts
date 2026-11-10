import { Injectable } from '@nestjs/common';
import type { UserOf } from '../domain/index.js';
import { UsersRepository } from './users.repository.js';
import { Role } from '../../common/constants/role.enum.js';

type UserStores = { [R in Role]: Map<string, UserOf<R>> };

@Injectable()
export class InMemoryUsersRepository extends UsersRepository {
    private readonly stores: UserStores = {
        [Role.TENANT]: new Map(),
        [Role.LANDLORD]: new Map(),
        [Role.ADMIN]: new Map(),
    };

    create<R extends Role>(role: R, user: UserOf<R>): Promise<UserOf<R>> {
        this.storeOf(role).set(user.id, structuredClone(user));
        return Promise.resolve(structuredClone(user));
    }

    findById<R extends Role>(role: R, id: string): Promise<UserOf<R> | null> {
        const user = this.storeOf(role).get(id);
        return Promise.resolve(user ? structuredClone(user) : null);
    }

    update<R extends Role>(role: R, user: UserOf<R>): Promise<UserOf<R>> {
        const store = this.storeOf(role);
        if (!store.has(user.id)) {
            return Promise.reject(new Error(`User ${user.id} not found`));
        }
        store.set(user.id, structuredClone(user));
        return Promise.resolve(structuredClone(user));
    }

    delete(role: Role, id: string): Promise<void> {
        this.storeOf(role).delete(id);
        return Promise.resolve();
    }

    private storeOf<R extends Role>(role: R): Map<string, UserOf<R>> {
        return this.stores[role] as Map<string, UserOf<R>>;
    }
}