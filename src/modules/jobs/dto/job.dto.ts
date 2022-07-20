import { IsOptional } from 'class-validator';
import { StringField } from '../../../decorators';

export class ApplyJobDto {
  @StringField({ swagger: true })
  jobId: string;

  @StringField({ swagger: true })
  recruiterAccountId: string;

  @StringField({ swagger: true })
  contactEmail: string;

  @StringField({ swagger: true })
  contactNumber: string;

  @StringField({ swagger: false, required: false })
  @IsOptional()
  resumeUrl?: string;

  @StringField({ swagger: false, required: false })
  @IsOptional()
  coverLetter?: string;
}

export class UpdateApplicantStatusDto {
  @StringField({ swagger: true })
  applicantId: string;

  @StringField({ swagger: true })
  status: 'un_reviewed' | 'reviewed';
}

export class GetJobApplicantDocumentDto {
  @StringField({ swagger: true })
  jobId: string;
}

