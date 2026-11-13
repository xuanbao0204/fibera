import { Module } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { UsersModule } from '../users/users.module.js';
import { AccountsModule } from '../accounts/accounts.module.js';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { RolesGuard } from './guards/roles.guard.js';
import { JwtAuthGuard } from './guards/jwt-auth.guard.js';
import { APP_GUARD } from '@nestjs/core/constants.js';
import { AuthController } from './auth.controller.js';
import { SuperAdminSeeder } from './super-admin.seeder.js';
import { RefreshTokensService } from './refresh-tokens/refresh-tokens.service.js';
import { RefreshTokensRepository } from './refresh-tokens/refresh-tokens.repository.js';
import { DrizzleRefreshTokensRepository } from './refresh-tokens/drizzle-refresh-token.repository.js';

@Module({
  imports: [
    UsersModule,
    AccountsModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.getOrThrow('JWT_ACCESS_SECRET'),
        signOptions: {
          expiresIn: Number.parseInt(process.env.JWT_EXPIRES_IN || '3600', 10),
        },
      })
    })
  ],
  providers: [AuthService, RefreshTokensService, SuperAdminSeeder,
    { provide: RefreshTokensRepository, useClass: DrizzleRefreshTokensRepository }, 
    SuperAdminSeeder,
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
  ],
  exports: [AuthService],
  controllers: [AuthController],
})
export class AuthModule { }
