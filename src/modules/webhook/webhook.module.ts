import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { WebhookController } from './webhook.controller';
import { WebhookService } from './webhook.service';
import { QueueModule } from '../queue-management/queue.module';

@Module({
  imports: [
    QueueModule,
    SequelizeModule.forFeature([]),
  ],
  controllers: [WebhookController],
  providers: [WebhookService],
})
export class WebhookModule {}
