import { StringField } from '../../../decorators';

export class UserAboutDto {
  @StringField({ swagger: true })
  about: string;
}

export class UserSkillsDto {
  @StringField({ swagger: true })
  skills: string[];
}