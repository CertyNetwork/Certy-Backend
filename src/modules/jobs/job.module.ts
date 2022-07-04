import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { SequelizeModule } from '@nestjs/sequelize';
import { Applicant } from '../../models/applicant.model';
import { User } from '../../models/user.model';
import { JobController } from './job.controller';
import { JobService } from './job.service';

@Module({
  controllers: [JobController],
  providers: [JobService],
  imports: [
    CqrsModule,
    SequelizeModule.forFeature([Applicant, User]),
  ],
  exports: [JobService],
})
export class JobModule {}
