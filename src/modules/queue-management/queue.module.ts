import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import Redis from 'ioredis';
import { QueueService } from './queue.service';
import RedisConfig from '../../config/redis.config';
import CommonConfig from '../../config/common.config';
import { MailProcessor } from './processors/mail.processor';

@Module({
  imports: [
    BullModule.forRoot({
      prefix: `${RedisConfig.REDIS_PREFIX}{bull}`,
      createClient: (type) => {
        const opts =
          type !== 'client'
            ? { enableReadyCheck: false, maxRetriesPerRequest: null }
            : {};

        return CommonConfig.REDIS_CLUSTER
          ? new Redis.Cluster(
              [{ host: RedisConfig.REDIS_HOST, port: RedisConfig.REDIS_PORT }],
              {
                ...opts,
                redisOptions: {
                  // password: RedisConfig.REDIS_PASSWORD,
                },
              },
            )
          : new Redis({
              host: RedisConfig.REDIS_HOST,
              port: RedisConfig.REDIS_PORT,
              // db: RedisConfig.REDIS_DB,
              // password: RedisConfig.REDIS_PASSWORD,
              ...opts,
            });
      },
    }),
    BullModule.registerQueue(
      {
        name: 'queue-mail',
      }
    ),
  ],
  providers: [QueueService, MailProcessor],
  exports: [QueueService],
})
export class QueueModule {}
