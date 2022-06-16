import { StringField } from '../../../decorators';

export class StartVerificationDto {
  @StringField({ swagger: true })
  ref: string;

  @StringField({ swagger: true, required: false })
  token?: string;
}

export class FinishVerificationDto {
  @StringField({ swagger: true })
  jobId: string;

  @StringField({ swagger: true, required: false })
  jobToken?: string;
}

