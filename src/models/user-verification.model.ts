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
  tableName: 'user_verifications',
  underscored: true,
})
export class UserVerification extends Model {
  id: bigint;

  @Column({ type: DataType.INTEGER, field: 'user_id' })
  userId: string;

  @Column({ type: DataType.STRING, field: 'ref' })
  ref: string;

  @Column({ type: DataType.STRING, field: 'token' })
  token: string;

  @Column({ type: DataType.STRING, field: 'status', defaultValue: 'pending' })
  status: string;

  @Column({ type: DataType.STRING, field: 'provider' })
  provider: string;

  @Column({ type: DataType.STRING, field: 'meta_data' })
  metaData: string;

  @CreatedAt
  @Column({ type: DataType.BIGINT, field: 'created_at' })
  createdAt: number;

  @UpdatedAt
  @Column({ type: DataType.BIGINT, field: 'updated_at' })
  updatedAt: number;

  @BeforeCreate
  static updateTimeWhenCreated(instance: UserVerification) {
    instance.createdAt = Math.floor(Date.now());
    instance.updatedAt = Math.floor(Date.now());
    if (!instance.provider) {
      instance.provider = 'vouched-id';
    }
  }

  @BeforeUpdate
  static updateTimeWhenUpdated(instance: UserVerification) {
    instance.setDataValue('updatedAt', Math.floor(Date.now()));
  }

  @BeforeBulkUpdate
  @BeforeBulkCreate
  static updateTimeWhenBulk(instance: any) {
    instance.attributes.updatedAt = Math.floor(Date.now());
  }
}
