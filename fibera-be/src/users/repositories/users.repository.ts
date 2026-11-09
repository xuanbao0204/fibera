import { Role } from "../../common/constants/role.enum.js";
import { UserOf } from "../domain/index.js";

export abstract class UsersRepository {

    /**
     * Abstract method to create a new user based on the provided role and user data.
     * @template R - The role of the user being created.
     * @param role 
     * @param user 
     */
    abstract create<R extends Role>(role: R, user: UserOf<R>): Promise<UserOf<R>>;

    /**
     * Abstract method to find a user by their role and ID.
     * @template R - The role of the user being searched for.
     * @param role 
     * @param id 
     */
    abstract findById<R extends Role>(role: R, id: string): Promise<UserOf<R> | null>;

    /**
     * Abstract method to update an existing user based on their role and updated data.
     * @template R - The role of the user being updated.
     * @param role 
     * @param user 
     */
    abstract update<R extends Role>(role: R, user: UserOf<R>): Promise<UserOf<R>>;

    /**
     * Abstract method to delete a user based on their role and ID.
     * @param role 
     * @param id 
     */
    abstract delete(role: Role, id: string): Promise<void>;
}