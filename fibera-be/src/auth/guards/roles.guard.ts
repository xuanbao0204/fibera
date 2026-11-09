import {
    CanActivate,
    ExecutionContext,
    HttpStatus,
    Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ErrorCode } from '../../common/constants/error-code.enum.js';
import type { Role } from '../../common/constants/role.enum.js';
import { ApiException } from '../../common/exceptions/api.exception.js';
import { ROLES_KEY } from '../auth.constants.js';
import type { AuthenticatedRequest } from '../auth.types.js';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private readonly reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean {
        const roles = this.reflector.getAllAndOverride<Role[] | undefined>(
            ROLES_KEY,
            [context.getHandler(), context.getClass()],
        );
        if (!roles?.length) {
            return true;
        }

        const { account } = context
            .switchToHttp()
            .getRequest<AuthenticatedRequest>();
        if (!account || !roles.includes(account.role)) {
            throw new ApiException(
                HttpStatus.FORBIDDEN,
                ErrorCode.FORBIDDEN,
                'You do not have permission to perform this action',
            );
        }
        return true;
    }
}