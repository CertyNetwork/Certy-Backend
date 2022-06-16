import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectModel } from '@nestjs/sequelize';
import { lastValueFrom } from 'rxjs';
import { UserProfile } from 'src/models/user-profile.model';
import { UserVerification } from 'src/models/user-verification.model';
import vouchedConfig from 'src/config/vouched.config';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  constructor(
    @InjectModel(UserVerification)
    private readonly userVerificationModel: typeof UserVerification,
    @InjectModel(UserVerification)
    private readonly userProfileModel: typeof UserProfile,
    private http: HttpService
  ) {
    
  }

  @Cron(CronExpression.EVERY_MINUTE)
  async handleCron() {
    const completedJobs = await this.userVerificationModel.findAll({
      where: {
        status: 'completed'
      }
    });
    if (!completedJobs || !completedJobs.length) {
      return;
    }
    const jobIdsQuery = completedJobs.map(jb => `ids=${jb.ref}`).join('&') + '&ids=null';
    const url = `https://verify.vouched.id/api/jobs?${jobIdsQuery}`;
    const resultObservable = this.http.get(url, {
      headers: {
        Accept: 'application/json; charset=utf-8',
        'X-API-Key': vouchedConfig.VOUCHED_PRIVATE_KEY
      }
    });

    const { data: { total, items: jobs } } = await lastValueFrom(resultObservable);
    if (!total) {
      return;
    }

    const resolvedJobs = jobs.filter(jd => jd.status === 'completed');
    for (const job of resolvedJobs) {
      const { result } = job;
      const jobEntity = completedJobs.find(jd => jd.ref === job.id);
      if (jobEntity) {
        jobEntity.status = result.success ? 'approved' : 'failed';
        jobEntity.metaData = JSON.stringify(result);
        await jobEntity.save();
      }
    }
  }
}