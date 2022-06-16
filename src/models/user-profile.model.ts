import { v4 as uuidv4 } from 'uuid';
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
  tableName: 'user_profiles',
  underscored: true,
})
export class UserProfile extends Model {
  id: bigint;

  @Column({ type: DataType.ENUM('individual', 'institution'), field: 'user_type'})
  userType: 'individual' | 'institution';

  @Column({
    type: DataType.STRING,
    field: 'email',
    unique: true
  })
  email: string;

  @Column({ type: DataType.BOOLEAN, field: 'email_verified'})
  emailVerified: boolean;

  @Column({
    type: DataType.STRING,
    field: 'mobile_number',
    unique: true
  })
  mobileNumber: string;

  @Column({ type: DataType.BOOLEAN, field: 'mobile_verified'})
  mobileVerified: boolean;

  @Column({ type: DataType.STRING, field: 'display_name' })
  displayName: string;

  @Column({ type: DataType.STRING, field: 'location' })
  location: string;

  @Column({ type: DataType.STRING, field: 'bio' })
  bio: string;

  @Column({ type: DataType.STRING, field: 'linkedIn_link' })
  linkedInLink: string;

  @Column({ type: DataType.STRING, field: 'github_link' })
  githubLink: string;

  @CreatedAt
  @Column({ type: DataType.BIGINT, field: 'created_at' })
  createdAt: number;

  @UpdatedAt
  @Column({ type: DataType.BIGINT, field: 'updated_at' })
  updatedAt: number;

  @BeforeCreate
  static updateTimeWhenCreated(instance: UserProfile) {
    instance.createdAt = Math.floor(Date.now());
    instance.updatedAt = Math.floor(Date.now());
  }

  @BeforeUpdate
  static updateTimeWhenUpdated(instance: UserProfile) {
    instance.setDataValue('updatedAt', Math.floor(Date.now()));
  }

  @BeforeBulkUpdate
  @BeforeBulkCreate
  static updateTimeWhenBulk(instance) {
    instance.attributes.updatedAt = Math.floor(Date.now());
  }
}
