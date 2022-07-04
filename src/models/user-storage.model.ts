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
  tableName: 'user_storage',
  underscored: true,
})
export class UserStorage extends Model {
  id: bigint;

  @Column({ type: DataType.INTEGER, field: 'user_id' })
  userId: string;

  @Column({ type: DataType.STRING, field: 'root_cid' })
  rootCid: string;

  @Column({ type: DataType.STRING, field: 'files' })
  files: string;

  @Column({ type: DataType.STRING, field: 'provider', defaultValue: 'web3-storage' })
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
  static updateTimeWhenCreated(instance: UserStorage) {
    instance.createdAt = Math.floor(Date.now());
    instance.updatedAt = Math.floor(Date.now());
  }

  @BeforeUpdate
  static updateTimeWhenUpdated(instance: UserStorage) {
    instance.setDataValue('updatedAt', Math.floor(Date.now()));
  }

  @BeforeBulkUpdate
  @BeforeBulkCreate
  static updateTimeWhenBulk(instance: any) {
    instance.attributes.updatedAt = Math.floor(Date.now());
  }
}
