import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserProfile } from 'models/user-profile.model';
import { UserVerification } from 'models/user-verification.model';
import { User } from 'models/user.model';
import { QueueModule } from 'modules/queue-management/queue.module';
import { TasksService } from './task.service';

@Module({
  imports: [
    HttpModule,
    SequelizeModule.forFeature([UserVerification, UserProfile, User]),
    QueueModule
  ],
  providers: [TasksService],
})
export class CronjobModule {}
