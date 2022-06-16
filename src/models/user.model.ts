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
  tableName: 'users',
  underscored: true,
})
export class User extends Model {
  id: bigint;

  @Column({ type: DataType.STRING, field: 'nonce', unique: true })
  nonce: string;

  @Column({ type: DataType.STRING, field: 'address',  unique: true })
  address: string;

  @CreatedAt
  @Column({ type: DataType.BIGINT, field: 'created_at' })
  createdAt: number;

  @UpdatedAt
  @Column({ type: DataType.BIGINT, field: 'updated_at' })
  updatedAt: number;

  @BeforeCreate
  static updateTimeWhenCreated(instance: User) {
    instance.createdAt = Math.floor(Date.now());
    instance.updatedAt = Math.floor(Date.now());
    instance.nonce = uuidv4();
  }

  @BeforeUpdate
  static updateTimeWhenUpdated(instance: User) {
    instance.setDataValue('updatedAt', Math.floor(Date.now()));
  }

  @BeforeBulkUpdate
  @BeforeBulkCreate
  static updateTimeWhenBulk(instance) {
    instance.attributes.updatedAt = Math.floor(Date.now());
  }
}
