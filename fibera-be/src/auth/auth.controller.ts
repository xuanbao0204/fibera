import { Body, Controller, Res, Post, HttpCode, HttpStatus, Get, Req } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { ConfigService } from '@nestjs/config';
import { Public } from './auth.decorators.js';
import { ResponseMessage } from '../common/decorators/response-message.decorator.js';
import { RegisterDto } from './dto/register.dto.js';
import { LoginDto } from './dto/auth.dto.js';
import { ACCESS_TOKEN_COOKIE, REFRESH_COOKIE_PATH, REFRESH_TOKEN_COOKIE } from './auth.constants.js';
import type { CookieOptions, Request, Response } from 'express';

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
        const { account, accessToken, refreshToken } = await this.auth.register(dto);
        this.setAuthCookies(res, accessToken, refreshToken);
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
        const { account, accessToken, refreshToken } = await this.auth.login(
            dto.email,
            dto.password,
        );
        this.setAuthCookies(res, accessToken, refreshToken);
        return { account };
    }

    @Public()
    @HttpCode(HttpStatus.OK)
    @Post('refresh')
    @ResponseMessage('Token refreshed')
    async refresh(
        @Req() req: Request,
        @Res({ passthrough: true }) res: Response,
    ) {
        const { account, accessToken, refreshToken } = await this.auth.refresh(
            this.readRefreshCookie(req),
        );
        this.setAuthCookies(res, accessToken, refreshToken);
        return { account };
    }

    @Public()
    @HttpCode(HttpStatus.OK)
    @Post('logout')
    @ResponseMessage('Logged out successfully')
    async logout(
        @Req() req: Request,
        @Res({ passthrough: true }) res: Response,
    ): Promise<void> {
        await this.auth.logout(this.readRefreshCookie(req));
        this.clearAuthCookies(res);
    }

    private cookieOptions(): CookieOptions {
        return {
            httpOnly: true,
            secure: this.config.get<string>('NODE_ENV') === 'production',
            sameSite: 'lax',
            path: '/',
        };
    }

    private readRefreshCookie(req: Request): string {
        const cookies = req.cookies as Record<string, unknown> | undefined;
        const value = cookies?.[REFRESH_TOKEN_COOKIE];
        return typeof value === 'string' ? value : '';
    }

    private setAuthCookies(res: Response, accessToken: string, refreshToken: string): void {
        const base = this.cookieOptions();
        res.cookie(ACCESS_TOKEN_COOKIE, accessToken, {
            ...base,
            maxAge: Number(this.config.getOrThrow<string>('JWT_EXPIRES_IN')) * 1000,
        });
        res.cookie(REFRESH_TOKEN_COOKIE, refreshToken, {
            ...base,
            path: REFRESH_COOKIE_PATH,
            maxAge:
                Number(this.config.getOrThrow<string>('REFRESH_TOKEN_EXPIRES_IN')) * 1000,
        });
    }

    private clearAuthCookies(res: Response): void {
        const base = this.cookieOptions();
        res.clearCookie(ACCESS_TOKEN_COOKIE, base);
        res.clearCookie(REFRESH_TOKEN_COOKIE, { ...base, path: REFRESH_COOKIE_PATH });
    }
}
