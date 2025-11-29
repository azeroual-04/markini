import { SetMetadata } from '@nestjs/common';

/**
 * Roles decorator
 * Used to specify required roles for endpoints
 * Usage: @Roles('admin', 'doctor')
 */
export const Roles = (...roles: string[]) => SetMetadata('roles', roles);
