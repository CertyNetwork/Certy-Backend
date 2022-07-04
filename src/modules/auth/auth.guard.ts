import {
  CanActivate,
  Injectable,
  ExecutionContext,
  UnauthorizedException,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Reflector } from '@nestjs/core';
import { AuthCacheService } from '../cache-management/auth-cache.service';
import { IS_PUBLIC_KEY } from 'decorators/public.decorator';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private readonly cacheService: AuthCacheService,
    private reflector: Reflector,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const httpContext = context.switchToHttp();
    const request = httpContext.getRequest();
    const Authorization = request.get('Authorization');
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }
    let token = '';
    if (Authorization) {
      token = Authorization.replace('Bearer ', '');
    } else if (request.query.token) {
      token = request.query.token;
    }

    if (!token) {
      return false;
    }

    const hasLogoutCache = await this.cacheService.hasTokenLogOut(token);
    if (hasLogoutCache) {
      throw new HttpException(
        'User has been logged out',
        HttpStatus.UNAUTHORIZED,
      );
    }
    try {
      const data = this.authService.verifyToken(token);
      request.user = data;

      return !!data.userId;
    } catch (e) {
      throw new UnauthorizedException('Token invalid');
    }
  }
}
