import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AccountsService } from '../accounts/accounts.service.js';
import { Role } from '../common/constants/role.enum.js';
import { normalizeEmail } from '../common/utils/normalize.util.js';
import { UsersService } from '../users/users.service.js';

const MIN_PASSWORD_LENGTH = 8;
const MAX_PASSWORD_BYTES = 72;

@Injectable()
export class SuperAdminSeeder implements OnApplicationBootstrap {
    private readonly logger = new Logger(SuperAdminSeeder.name);

    constructor(
        private readonly users: UsersService,
        private readonly accounts: AccountsService,
        private readonly config: ConfigService,
    ) { }

    async onApplicationBootstrap(): Promise<void> {
        const email = normalizeEmail(
            this.config.getOrThrow<string>('SUPER_ADMIN_EMAIL'),
        );
        const password = this.config.getOrThrow<string>('SUPER_ADMIN_PASSWORD');
        this.assertPasswordUsable(password);

        if (await this.accounts.existsByEmail(email)) {
            return;
        }

        const admin = await this.users.create(Role.ADMIN, {
            fullName: 'Super Admin',
            phone: '',
            avatarUrl: null,
            isSuperAdmin: true,
        });

        try {
            await this.accounts.create({
                email,
                password,
                role: Role.ADMIN,
                userId: admin.id,
            });
        } catch (error) {
            await this.users.remove(Role.ADMIN, admin.id);
            throw error;
        }

        this.logger.log(`Super admin created: ${email}`);
    }

    private assertPasswordUsable(password: string): void {
        if (
            password.length < MIN_PASSWORD_LENGTH ||
            Buffer.byteLength(password) > MAX_PASSWORD_BYTES
        ) {
            throw new Error(
                `SUPER_ADMIN_PASSWORD must be ${MIN_PASSWORD_LENGTH}-${MAX_PASSWORD_BYTES} bytes long`,
            );
        }
    }
}