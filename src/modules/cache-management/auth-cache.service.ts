import { Injectable } from '@nestjs/common';
import { CacheService } from './cache.service';
import CacheConstant from '../../constants/cache.constant';

@Injectable()
export class AuthCacheService {
  constructor(private readonly cacheService: CacheService) {}

  public setTokenLogOut(token: string, time: number) {
    return this.cacheService.set(
      `${CacheConstant.PREFIX_CACHE_ACCESS_TOKEN}${token}`,
      true,
      time,
    );
  }

  public hasTokenLogOut(token) {
    return this.cacheService.exists(
      `${CacheConstant.PREFIX_CACHE_ACCESS_TOKEN}${token}`,
    );
  }

  public getAccessToken(userId: any, refreshToken: string) {
    const cacheKey = `refresh-${refreshToken}.activeAccessTokens.${userId}`;
    return this.cacheService.get(cacheKey);
  }

  public registerAccessToken(userId: any, refreshToken: string, accessToken: string) {
    const cacheKey = `refresh-${refreshToken}.activeAccessTokens.${userId}`;
    this.cacheService.set(cacheKey, accessToken);
  }
}
