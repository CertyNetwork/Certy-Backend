import { StringField } from '../../../decorators';

export class LoginDto {
  @StringField({ swagger: true })
  accountId: string;

  @StringField({ swagger: true })
  publicKey: string;

  @StringField({ swagger: true })
  signature: string;
}

export class RefreshTokenDto {
  @StringField({ swagger: true })
  refreshToken: string;
}
