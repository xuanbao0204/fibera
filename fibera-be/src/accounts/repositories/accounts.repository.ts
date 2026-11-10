import type { Account } from '../domain/index.js';

export abstract class AccountsRepository {

    /**
     * Abstract method to create a new account.
     * @param account - The account data to be created.
     */
    abstract create(account: Account): Promise<Account>;

    /**
     * Abstract method to find an account by its ID.
     * @param id - The ID of the account to find.
     */
    abstract findById(id: string): Promise<Account | null>;

    /**
     * Abstract method to find an account by its email.
     * @param email - The email of the account to find.
     */
    abstract findByEmail(email: string): Promise<Account | null>;

    /**
     * Abstract method to find an account by its user ID.
     * @param userId - The user ID of the account to find.
     */
    abstract findByUserId(userId: string): Promise<Account | null>;

    /**
     * Abstract method to update an existing account.
     * @param account - The updated account data.
     */
    abstract update(account: Account): Promise<Account>;
}