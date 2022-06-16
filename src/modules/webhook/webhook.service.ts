import { Injectable } from '@nestjs/common';
import { Sequelize } from 'sequelize-typescript';
import { QueueService } from '../queue-management/queue.service';

@Injectable()
export class WebhookService {
  constructor(
    private readonly queueService: QueueService,
    private readonly sequelizeInstance: Sequelize,
  ) {}

  async handleVouchedIdWebhook(data) {
    
  }
}
