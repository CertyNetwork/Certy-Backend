import { Module, forwardRef } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import Redis from 'ioredis';
import { QueueService } from './queue.service';
import RedisConfig from '../../config/redis.config';
import CommonConfig from '../../config/common.config';
import { MailProcessor } from './processors/mail.processor';
import { CertificationModule } from 'modules/certification/certification.module';
import { CertPullingProcessor } from './processors/cert-pulling.processor';

@Module({
  imports: [
    CertificationModule,
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
      },
      {
        name: 'cert-pulling',
      }
    ),
  ],
  providers: [QueueService, MailProcessor, CertPullingProcessor],
  exports: [QueueService],
})
export class QueueModule {}
