import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';

@Injectable()
export class QueueService {
  constructor(
    @InjectQueue('queue-mail') private readonly mailQueue: Queue,
    @InjectQueue('cert-pulling') private readonly certPullingQueue: Queue
  ) {
    //
  }

  async createKycFailEmail(data: { email: string }) {
    await this.mailQueue.add('email-kyc-fail', data, {});
  }

  async pullingCert(user: any) {
    await this.certPullingQueue.add(user, { delay: 3000 });
  }
}
