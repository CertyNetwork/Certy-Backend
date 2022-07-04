import { StringField, DateField, NumberField } from '../../../decorators';
import { IsOptional, Validate } from 'class-validator';
import { IsBeforeConstraint } from '../../../decorators/isBefore.decorator';

export class UserExperienceDto {
  @NumberField({ swagger: true, required: false })
  @IsOptional()
  id: number;
  
  @StringField({ swagger: true })
  company: string;

  @StringField({ swagger: true })
  title: string;

  @StringField({ swagger: true })
  location: string;

  @StringField({ swagger: true, required: false })
  @IsOptional()
  industry: string;

  @StringField({ swagger: true, required: false })
  @IsOptional()
  employmentType?: 'full-time' | 'part-time' | 'self-employed' | 'free-lance' | 'internship' | 'contract';

  @DateField({ swagger: true })
  @Validate(IsBeforeConstraint, ['endDate'])
  startDate: Date;

  @DateField({ swagger: true })
  endDate: Date;

  @StringField({ swagger: true })
  description: string;
}