import {
    Injectable,
    UnauthorizedException,
    ExecutionContext,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

// authJWTRefreshGuard is a guard that validates the refresh token
@Injectable()
export class AuthJwtRefreshGuard extends AuthGuard('jwt-refresh') {
    constructor() {
        super();
    }

    canActivate(context: ExecutionContext) {
        return super.canActivate(context);
    }

    handleRequest<TUser = any>(
        err: Error,
        user: TUser,
        info: Error,
        context: ExecutionContext
    ): TUser {
        if (err || !user) {
            throw new UnauthorizedException(
                'Refresh token is invalid or expired'
            );
        }

        return user;
    }
}
