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
  tableName: 'organization_profiles',
  underscored: true,
})
export class OrganizationProfile extends Model {
  @Column({ field: 'user_id', primaryKey: true })
  userId: bigint;

  @Column({
    type: DataType.STRING,
    field: 'email',
    unique: true
  })
  email: string;

  @Column({ type: DataType.STRING, field: 'company_name'})
  companyName: string;

  @Column({ type: DataType.STRING, field: 'about'})
  about: string;

  @Column({ type: DataType.STRING, field: 'location' })
  location: string;

  @Column({ type: DataType.STRING, field: 'organization_type' })
  organizationType: string;

  @Column({ type: DataType.STRING, field: 'working_hours' })
  workingHours: string;

  @Column({ type: DataType.STRING, field: 'organization_size' })
  organizationSize: string;

  @CreatedAt
  @Column({ type: DataType.BIGINT, field: 'created_at' })
  createdAt: number;

  @UpdatedAt
  @Column({ type: DataType.BIGINT, field: 'updated_at' })
  updatedAt: number;

  @BeforeCreate
  static updateTimeWhenCreated(instance: OrganizationProfile) {
    instance.createdAt = Math.floor(Date.now());
    instance.updatedAt = Math.floor(Date.now());
  }

  @BeforeUpdate
  static updateTimeWhenUpdated(instance: OrganizationProfile) {
    instance.setDataValue('updatedAt', Math.floor(Date.now()));
  }

  @BeforeBulkUpdate
  @BeforeBulkCreate
  static updateTimeWhenBulk(instance) {
    instance.attributes.updatedAt = Math.floor(Date.now());
  }
}
