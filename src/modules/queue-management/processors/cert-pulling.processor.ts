import {
  Process,
  Processor,
  OnQueueActive,
  OnQueueCompleted,
  OnQueueFailed,
} from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { CertificationService } from '../../certification/certification.service';

@Processor('cert-pulling')
export class CertPullingProcessor {
  constructor(
    private certificationService: CertificationService
  ) {

  }
  private readonly logger = new Logger(CertPullingProcessor.name);

  @Process()
  async handleCertPull(job: Job) {
    return this.certificationService.pullCertificate(job.data);
  }
  
  @OnQueueActive()
  onActive(job: Job) {
    this.logger.debug(
      `Processing job ${job.id} of type ${job.name}. Data: ${JSON.stringify(
        job.data,
      )}`,
    );
  }

  @OnQueueCompleted()
  onComplete(job: Job, result: any) {
    this.logger.debug(
      `Completed job ${job.id} of type ${job.name}. Result: ${JSON.stringify(
        result,
      )}`,
    );
  }

  @OnQueueFailed()
  onError(job: Job, error: any) {
    this.logger.error(
      `Failed job ${job.id} of type ${job.name}: ${error.message}`,
      error.stack,
    );
  }
}
