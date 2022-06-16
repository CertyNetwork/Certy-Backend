import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserProfile } from 'src/models/user-profile.model';
import { UserVerification } from 'src/models/user-verification.model';
import { TasksService } from './task.service';

@Module({
  imports: [
    HttpModule,
    ScheduleModule.forRoot(),
    SequelizeModule.forFeature([UserVerification, UserProfile])
  ],
  providers: [TasksService],
})
export class CronjobModule {}
