import { Module } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { UsersModule } from '../users/users.module.js';
import { AccountsModule } from '../accounts/accounts.module.js';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { config } from 'rxjs/internal/config';
import { RolesGuard } from './guards/roles.guard.js';
import { JwtAuthGuard } from './guards/jwt-auth.guard.js';
import { APP_GUARD } from '@nestjs/core/constants.js';
import { AuthController } from './auth.controller.js';
import { SuperAdminSeeder } from './super-admin.seeder.js';

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
  providers: [AuthService, SuperAdminSeeder,
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
  ],
  exports: [AuthService],
  controllers: [AuthController],
})
export class AuthModule { }
