import {
    createParamDecorator,
    ExecutionContext,
    SetMetadata,
} from '@nestjs/common';
import type { PublicAccount } from '../accounts/domain/index.js';
import type { Role } from '../common/constants/role.enum.js';
import { IS_PUBLIC_KEY, ROLES_KEY } from './auth.constants.js';
import type { AuthenticatedRequest } from './auth.types.js';

/**
 * Decorator to mark a route as public (no authentication required).
 */

export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

/**
 * Decorator to specify the roles allowed to access a route.
 */
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);

export const CurrentAccount = createParamDecorator(
    (_data: unknown, context: ExecutionContext): PublicAccount =>
        context.switchToHttp().getRequest<AuthenticatedRequest>().account,
);