import { Injectable } from '@nestjs/common';
import type { Account } from '../domain/index.js';
import { AccountsRepository } from './accounts.repository.js';

@Injectable()
export class InMemoryAccountsRepository extends AccountsRepository {
    private readonly accounts = new Map<string, Account>();

    create(account: Account): Promise<Account> {
        const conflict = this.find(
            (item) => item.email === account.email || item.userId === account.userId,
        );
        if (conflict) {
            return Promise.reject(new Error('Account email or userId already exists'));
        }
        this.accounts.set(account.id, structuredClone(account));
        return Promise.resolve(structuredClone(account));
    }

    findById(id: string): Promise<Account | null> {
        return Promise.resolve(this.copy(this.accounts.get(id)));
    }

    findByEmail(email: string): Promise<Account | null> {
        return Promise.resolve(this.copy(this.find((item) => item.email === email)));
    }

    findByUserId(userId: string): Promise<Account | null> {
        return Promise.resolve(
            this.copy(this.find((item) => item.userId === userId)),
        );
    }

    update(account: Account): Promise<Account> {
        if (!this.accounts.has(account.id)) {
            return Promise.reject(new Error(`Account ${account.id} not found`));
        }
        this.accounts.set(account.id, structuredClone(account));
        return Promise.resolve(structuredClone(account));
    }

    private find(predicate: (account: Account) => boolean): Account | undefined {
        return [...this.accounts.values()].find(predicate);
    }

    private copy(account: Account | undefined): Account | null {
        return account ? structuredClone(account) : null;
    }
}