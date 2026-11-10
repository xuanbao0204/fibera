import { Body, Controller, Res, Post, HttpCode, HttpStatus, Get } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { ConfigService } from '@nestjs/config';
import { CurrentAccount, Public } from './auth.decorators.js';
import { ResponseMessage } from '../common/decorators/response-message.decorator.js';
import { RegisterDto } from './dto/register.dto.js';
import { LoginDto } from './dto/auth.dto.js';
import { ACCESS_TOKEN_COOKIE } from './auth.constants.js';
import type { PublicAccount } from '../accounts/domain/account.types.js';
import type { CookieOptions, Response } from 'express';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly auth: AuthService,
        private readonly config: ConfigService,
    ) { }

    @Public()
    @Post('register')
    @ResponseMessage('Registered successfully')
    async register(
        @Body() dto: RegisterDto,
        @Res({ passthrough: true }) res: Response,
    ) {
        const { account, accessToken } = await this.auth.register(dto);
        this.setAuthCookie(res, accessToken);
        return { account };
    }

    @Public()
    @HttpCode(HttpStatus.OK)
    @Post('login')
    @ResponseMessage('Logged in successfully')
    async login(
        @Body() dto: LoginDto,
        @Res({ passthrough: true }) res: Response,
    ) {
        const { account, accessToken } = await this.auth.login(
            dto.email,
            dto.password,
        );
        this.setAuthCookie(res, accessToken);
        return { account };
    }

    @Public()
    @HttpCode(HttpStatus.OK)
    @Post('logout')
    @ResponseMessage('Logged out successfully')
    logout(@Res({ passthrough: true }) res: Response): void {
        res.clearCookie(ACCESS_TOKEN_COOKIE, this.cookieOptions());
    }

    @Get('me')
    @ResponseMessage('Current user')
    me(@CurrentAccount() account: PublicAccount) {
        return this.auth.getCurrent(account);
    }

    private cookieOptions(): CookieOptions {
        return {
            httpOnly: true,
            secure: this.config.get<string>('NODE_ENV') === 'production',
            sameSite: 'lax',
            path: '/',
        };
    }

    private setAuthCookie(res: Response, token: string): void {
        const maxAge =
            Number(this.config.getOrThrow<string>('JWT_EXPIRES_IN')) * 1000;
        res.cookie(ACCESS_TOKEN_COOKIE, token, { ...this.cookieOptions(), maxAge });
    }
}
