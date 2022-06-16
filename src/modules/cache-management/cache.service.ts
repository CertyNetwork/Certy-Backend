import { Injectable, Inject } from '@nestjs/common';
import { ClusterService, RedisService } from '@liaoliaots/nestjs-redis';
import Redis, { Cluster, RedisKey, Result } from 'ioredis';
import CommonConfig from '../../config/common.config';

@Injectable()
export class CacheService {
  private redis: Cluster | Redis;

  constructor(
    @Inject(CommonConfig.REDIS_CLUSTER ? ClusterService : RedisService)
    private readonly clusterService,
  ) {
    this.redis = this.clusterService.getClient();
  }

  async ping() {
    return this.redis.ping();
  }

  async get(key: RedisKey): Promise<Result<any, any>> {
    return this.redis.get(key);
  }

  async set(key: RedisKey, value, ttl?: number) {
    if(ttl) {
      return this.redis.set(key, value, 'EX', ttl);
    }
    return this.redis.set(key, value);
  }

  async ttl(key: RedisKey): Promise<number> {
    return this.redis.ttl(key);
  }
  
  async exists(key: RedisKey) {
    return this.redis.exists(key);
  }

  async expire(key: RedisKey, ttl: number) {
    return this.redis.expire(key, ttl);
  }

  async del(key: RedisKey) {
    return this.redis.del(key);
  }
}
