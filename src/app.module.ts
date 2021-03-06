import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { SequelizeModule } from '@nestjs/sequelize';
import { JobModule } from './modules/jobs/job.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthGuard } from './modules/auth/auth.guard';

import { AuthModule } from './modules/auth/auth.module';
import { CronjobModule } from './modules/cron-job/cron-job.module';
import { KycModule } from './modules/kyc/kyc.module';
import { QueueModule } from './modules/queue-management/queue.module';
import { UserModule } from './modules/user/user.module';
import { Web3StorageModule } from './modules/web3.storage/web3.storage.module';
import { WebhookModule } from './modules/webhook/webhook.module';
import { ProfileModule } from './modules/profile/profile.module';
import { ScheduleModule } from '@nestjs/schedule';
import { CertificationModule } from 'modules/certification/certification.module';

const APP_MODULES = [
  ScheduleModule.forRoot(),
  AuthModule, UserModule, KycModule, Web3StorageModule,
  QueueModule, WebhookModule, CronjobModule, JobModule, CertificationModule,
  ProfileModule
];

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    SequelizeModule.forRoot({
      dialect: 'mysql',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      autoLoadModels: true,
      synchronize: false,
      logging: process.env.NODE_ENV === 'development',
    }),
    ...APP_MODULES,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
