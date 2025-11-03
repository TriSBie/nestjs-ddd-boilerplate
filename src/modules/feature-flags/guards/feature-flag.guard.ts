import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { FeatureFlagsService } from '../feature-flags.service';
import { FEATURE_FLAG_KEY } from '../decorators/feature-flag.decorator';

@Injectable()
export class FeatureFlagGuard implements CanActivate {
    constructor(
        private readonly reflector: Reflector,
        private readonly featureFlags: FeatureFlagsService
    ) {}

    canActivate(context: ExecutionContext): boolean | Promise<boolean> {
        const featureKey = this.reflector.getAllAndOverride<string | undefined>(
            FEATURE_FLAG_KEY,
            [context.getHandler(), context.getClass()]
        );
        if (!featureKey) {
            return true;
        }

        const req = context.switchToHttp().getRequest();
        const user = req.user as
            | { id?: string; email?: string; role?: string }
            | undefined;
        const attributes = {
            id: user?.id,
            email: user?.email,
            role: user?.role,
        } as const;

        const enabled = this.featureFlags.isOn(featureKey, attributes);
        if (!enabled) {
            throw new UnauthorizedException(
                `Feature "${featureKey}" is disabled`
            );
        }
        return true;
    }
}
