import { IsEmail, IsOptional, IsUrl, ValidateIf } from 'class-validator';
import { StringField } from '../../../decorators';

export class UserInfoDto {
  
  @StringField({ swagger: true })
  displayName: string;

  @StringField({ swagger: true })
  @IsEmail()
  email: string;

  @StringField({ swagger: true })
  location: string;

  @StringField({ swagger: true, required: false })
  @IsOptional()
  bio?: string;

  @StringField({ swagger: true, required: false })
  @IsOptional()
  @IsUrl()
  @ValidateIf((object, value) => !!value)
  linkedinLink?: string;

  @StringField({ swagger: true, required: false })
  @IsOptional()
  @IsUrl()
  @ValidateIf((object, value) => !!value)
  githubLink?: string;
}

export class OrganizationInfoDto {
  @StringField({ swagger: true })
  companyName: string;

  @StringField({ swagger: true })
  @IsEmail()
  email: string;

  @StringField({ swagger: true })
  location: string;

  @StringField({ swagger: true })
  organizationType: string;

  @StringField({ swagger: true })
  workingHours: string;

  @StringField({ swagger: true })
  organizationSize: string;
}