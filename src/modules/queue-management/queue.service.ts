import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';

@Injectable()
export class QueueService {
  constructor(
    @InjectQueue('queue-mail') private readonly mailQueue: Queue
  ) {
    //
  }

  async createKycFailEmail(data: { email: string }) {
    await this.mailQueue.add('email-kyc-fail', data, {});
  }
}
