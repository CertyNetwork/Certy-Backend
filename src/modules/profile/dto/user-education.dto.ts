import { IsOptional, Validate } from 'class-validator';
import { IsBeforeConstraint } from '../../../decorators/isBefore.decorator';
import { StringField, NumberField, DateField } from '../../../decorators';

export class UserEducationDto {
  @NumberField({ swagger: true, required: false })
  @IsOptional()
  id: number;
  
  @StringField({ swagger: true })
  school: string;

  @StringField({ swagger: true })
  degree: string;

  @StringField({ swagger: true })
  grade: string;

  @StringField({ swagger: true, required: false })
  fieldOfStudy: string;

  @DateField({ swagger: true })
  @Validate(IsBeforeConstraint, ['endDate'])
  startDate: Date;

  @DateField({ swagger: true })
  endDate: Date;

  @StringField({ swagger: true })
  description: string;
}