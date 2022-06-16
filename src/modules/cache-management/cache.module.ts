import { Module, Global, DynamicModule } from '@nestjs/common';
import { CacheService } from './cache.service';
import {
  RedisModule,
  RedisModuleOptions,
  ClusterModule,
  ClusterModuleOptions,
} from '@liaoliaots/nestjs-redis';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule, ConfigService } from '@nestjs/config';
import CommonConfig from '../../config/common.config';
import RedisConfig from '../../config/redis.config';
import { DatabaseCacheService } from './database-cache.service';
import { AuthCacheService } from './auth-cache.service';

const useRedisCluster = CommonConfig.REDIS_CLUSTER;
let configRedis: DynamicModule;
if (useRedisCluster) {
  configRedis = ClusterModule.forRootAsync({
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: async (): Promise<ClusterModuleOptions> => {
      return {
        config: {
          nodes: [
            {
              host: RedisConfig.REDIS_HOST,
              port: RedisConfig.REDIS_PORT,
            },
          ],
        },
      };
    },
  });
} else {
  configRedis = RedisModule.forRootAsync({
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: async (): Promise<RedisModuleOptions> => {
      return {
        config: {
          host: RedisConfig.REDIS_HOST,
          port: RedisConfig.REDIS_PORT,
        },
      };
    },
  });
}
@Global()
@Module({
  imports: [configRedis, SequelizeModule.forFeature([])],
  providers: [CacheService, DatabaseCacheService, AuthCacheService],
  exports: [CacheService, DatabaseCacheService, AuthCacheService],
})
export class CacheModule {}
