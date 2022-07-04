import { StringField } from '../../../decorators';

export class UserTypeDto {
  
  @StringField({ swagger: true })
  userType: 'individual' | 'institution';
}