import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { InjectModel } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';
import { CertyError } from 'src/errors/cerrty.error';
import { UserVerification } from 'src/models/user-verification.model';

@Injectable()
export class KycService {
  constructor(
    protected commandBus: CommandBus,
    @InjectModel(UserVerification)
    private readonly userVerificationModel: typeof UserVerification,
    private readonly sequelizeInstance: Sequelize,
  ) {

  }

  async getVerificationStatus(userId: number) {
    const verificationJobs = await this.userVerificationModel.findAll({
      where: {
        userId: userId,
      }
    });
    let kycStatus = 'not_started';
    if (verificationJobs.some(jd => jd.status === 'approved')) {
      kycStatus = 'verified';
    } else if (verificationJobs.some(jd => jd.status === 'pending')) {
      kycStatus = 'pending';
    } else if (verificationJobs.some(jd => jd.status === 'completed')) {
      kycStatus = 'completed';
    } else if (verificationJobs.some(jd => jd.status === 'failed')) {
      kycStatus = 'failed';
    }

    return {
      kycStatus,
    }
  }

  async getLatestVerificationSession(userId: number, provider: string = 'vouched-id') {
    const approvedJob = await this.userVerificationModel.findOne({
      where: {
        userId: userId,
        provider,
        status: 'approved'
      }
    });

    if (approvedJob) {
      throw new CertyError('You have completed KYC verification already.');
    }

    const completedJob = await this.userVerificationModel.findOne({
      where: {
        userId: userId,
        provider,
        status: 'completed'
      }
    });

    if (completedJob) {
      throw new CertyError('Your KYC verification is being processed.');
    }

    const pendingJob = await this.userVerificationModel.findOne({
      where: {
        userId: userId,
        provider,
        status: 'pending'
      }
    });

    if (pendingJob) {
      return pendingJob.token;
    }

    return null;
  }

  async startVerification(userId: number, ref: string, token?: string, provider: string = 'vouched-id') {
    await this.userVerificationModel.create({
      userId: userId,
      ref,
      token,
      provider,
    });

    return {
      status: 'OK'
    };
  }

  async finishVerification(userId: number, jobId: string, jobToken?: string) {
    const verificationJob = await this.userVerificationModel.findOne({
      where: {
        userId,
        ref: jobId,
        status: 'pending'
      }
    });

    if (!verificationJob) {
      throw new CertyError('Not found the job');
    }

    verificationJob.status = 'completed';
    await verificationJob.save();

    return {
      status: 'OK'
    };
  }
}
