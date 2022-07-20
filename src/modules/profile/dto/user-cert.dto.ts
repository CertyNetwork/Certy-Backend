import { StringArrayField } from '../../../decorators';

export class UserCertDto {
  @StringArrayField({ swagger: true })
  certs: string[];
}