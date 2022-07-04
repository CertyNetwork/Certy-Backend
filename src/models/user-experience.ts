import {
  Column,
  Model,
  Table,
  BeforeUpdate,
  BeforeBulkUpdate,
  BeforeCreate,
  BeforeBulkCreate,
  DataType,
  CreatedAt,
  UpdatedAt,
} from 'sequelize-typescript';

@Table({
  tableName: 'user_profile_experiences',
  underscored: true,
})
export class UserExperience extends Model {
  id: bigint;

  @Column({ type: DataType.INTEGER, field: 'user_id' })
  userId: string;

  @Column({ type: DataType.STRING, field: 'title' })
  title: string;

  @Column({ type: DataType.ENUM('full-time', 'part-time', 'self-employed', 'free-lance', 'internship', 'contract'), field: 'employment_type'})
  employmentType: 'full-time' | 'part-time' | 'self-employed' | 'free-lance' | 'internship' | 'contract';

  @Column({ type: DataType.STRING, field: 'company_name', defaultValue: 'pending' })
  companyName: string;

  @Column({ type: DataType.STRING, field: 'location' })
  location: string;

  @Column({ type: DataType.DATE, field: 'start_date' })
  startDate: Date;

  @Column({ type: DataType.DATE, field: 'end_date' })
  endDate: Date;

  @Column({ type: DataType.STRING, field: 'description' })
  description: string;

  @Column({ type: DataType.STRING, field: 'industry' })
  industry: string;

  @CreatedAt
  @Column({ type: DataType.BIGINT, field: 'created_at' })
  createdAt: number;

  @UpdatedAt
  @Column({ type: DataType.BIGINT, field: 'updated_at' })
  updatedAt: number;

  @BeforeCreate
  static updateTimeWhenCreated(instance: UserExperience) {
    instance.createdAt = Math.floor(Date.now());
    instance.updatedAt = Math.floor(Date.now());
    if (!instance.employmentType) {
      instance.employmentType = 'full-time';
    }
  }

  @BeforeUpdate
  static updateTimeWhenUpdated(instance: UserExperience) {
    instance.setDataValue('updatedAt', Math.floor(Date.now()));
  }

  @BeforeBulkUpdate
  @BeforeBulkCreate
  static updateTimeWhenBulk(instance: any) {
    instance.attributes.updatedAt = Math.floor(Date.now());
  }
}
