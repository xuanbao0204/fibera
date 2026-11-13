import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';

import { ConfigModule } from '@nestjs/config';
import { HttpExceptionFilter } from './common/filters/http-exception.filter.js';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core/constants.js';
import { ResponseInterceptor } from './common/interceptors/response.interceptor.js';
import { UsersModule } from './users/users.module.js';
import { AccountsModule } from './accounts/accounts.module.js';
import { AuthModule } from './auth/auth.module.js';
import { DatabaseModule } from './database/database.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    DatabaseModule,
    UsersModule,
    AccountsModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService,
    AppService,
    { provide: APP_INTERCEPTOR, useClass: ResponseInterceptor },
    { provide: APP_FILTER, useClass: HttpExceptionFilter },
  ],
})
export class AppModule { }
