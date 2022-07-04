import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { CqrsModule } from '@nestjs/cqrs';
import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';
import { UserExperience } from '../../models/user-experience';
import { UserEducation } from '../../models/user-education';
import { UserProfile } from '../../models/user-profile.model';
import { User } from '../../models/user.model';
import { UserDocument } from '../../models/user-documents';
import { OrganizationProfile } from '../../models/organization-profile.model';

@Module({
  controllers: [ProfileController],
  providers: [ProfileService],
  imports: [
    CqrsModule,
    SequelizeModule.forFeature([User, UserExperience, UserEducation, UserProfile, OrganizationProfile, UserDocument]),
  ],
  exports: [ProfileService],
})
export class ProfileModule {

}
