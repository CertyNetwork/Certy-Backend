import { StringField, DateField, NumberField } from '../../../decorators';
import { IsOptional, Validate } from 'class-validator';
import { IsBeforeConstraint } from '../../../decorators/isBefore.decorator';

export class UserExperienceDto {
  @NumberField({ swagger: true, required: false })
  @IsOptional()
  id: number;
  
  @StringField({ swagger: true, name: 'company' })
  company: string;

  @StringField({ swagger: true, name: 'title' })
  title: string;

  @StringField({ swagger: true, name: 'location' })
  location: string;

  @StringField({ swagger: true, required: false, name: 'industry' })
  @IsOptional()
  industry: string;

  @StringField({ swagger: true, required: false, name: 'employmentType' })
  @IsOptional()
  employmentType?: 'full-time' | 'part-time' | 'self-employed' | 'free-lance' | 'internship' | 'contract';

  @DateField({ swagger: true })
  @Validate(IsBeforeConstraint, ['endDate'])
  startDate: Date;

  @DateField({ swagger: true })
  endDate: Date;

  @StringField({ swagger: true, name: 'description' })
  description: string;
}