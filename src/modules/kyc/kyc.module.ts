import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserProfile } from 'src/models/user-profile.model';
import { UserVerification } from 'src/models/user-verification.model';
import { KycController } from './kyc.controller';
import { KycService } from './kyc.service';

@Module({
  controllers: [KycController],
  providers: [KycService],
  imports: [
    CqrsModule,
    SequelizeModule.forFeature([UserProfile, UserVerification]),
  ],
  exports: [KycService],
})
export class KycModule {}
