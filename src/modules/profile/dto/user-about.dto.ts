import { StringArrayField, StringField } from '../../../decorators';

export class UserAboutDto {
  @StringField({ swagger: true })
  about: string;
}

export class UserSkillsDto {
  @StringArrayField({ swagger: true })
  skills: string[];
}