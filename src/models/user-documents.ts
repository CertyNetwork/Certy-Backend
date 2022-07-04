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
  tableName: 'user_documents',
  underscored: true,
})
export class UserDocument extends Model {
  id: bigint;

  @Column({ type: DataType.INTEGER, field: 'user_id' })
  userId: string;

  @Column({ type: DataType.STRING, field: 'document_type' })
  documentType: string;

  @Column({ type: DataType.STRING, field: 'metadata' })
  metadata: string;

  @Column({ type: DataType.STRING, field: 'document_uri' })
  documentUri: string;

  @CreatedAt
  @Column({ type: DataType.BIGINT, field: 'created_at' })
  createdAt: number;

  @UpdatedAt
  @Column({ type: DataType.BIGINT, field: 'updated_at' })
  updatedAt: number;

  @BeforeCreate
  static updateTimeWhenCreated(instance: UserDocument) {
    instance.createdAt = Math.floor(Date.now());
    instance.updatedAt = Math.floor(Date.now());
  }

  @BeforeUpdate
  static updateTimeWhenUpdated(instance: UserDocument) {
    instance.setDataValue('updatedAt', Math.floor(Date.now()));
  }

  @BeforeBulkUpdate
  @BeforeBulkCreate
  static updateTimeWhenBulk(instance: any) {
    instance.attributes.updatedAt = Math.floor(Date.now());
  }
}
