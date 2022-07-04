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
  tableName: 'user_profile_educations',
  underscored: true,
})
export class UserEducation extends Model {
  id: bigint;

  @Column({ type: DataType.INTEGER, field: 'user_id' })
  userId: string;

  @Column({ type: DataType.STRING, field: 'school' })
  school: string;

  @Column({ type: DataType.STRING, field: 'degree' })
  degree: string;

  @Column({ type: DataType.DATE, field: 'start_date' })
  startDate: Date;

  @Column({ type: DataType.DATE, field: 'end_date' })
  endDate: Date;

  @Column({ type: DataType.STRING, field: 'field_of_study' })
  fieldOfStudy: string;

  @Column({ type: DataType.STRING, field: 'grade' })
  grade: string;

  @Column({ type: DataType.STRING, field: 'description' })
  description: string;

  @CreatedAt
  @Column({ type: DataType.BIGINT, field: 'created_at' })
  createdAt: number;

  @UpdatedAt
  @Column({ type: DataType.BIGINT, field: 'updated_at' })
  updatedAt: number;

  @BeforeCreate
  static updateTimeWhenCreated(instance: UserEducation) {
    instance.createdAt = Math.floor(Date.now());
    instance.updatedAt = Math.floor(Date.now());
  }

  @BeforeUpdate
  static updateTimeWhenUpdated(instance: UserEducation) {
    instance.setDataValue('updatedAt', Math.floor(Date.now()));
  }

  @BeforeBulkUpdate
  @BeforeBulkCreate
  static updateTimeWhenBulk(instance: any) {
    instance.attributes.updatedAt = Math.floor(Date.now());
  }
}
