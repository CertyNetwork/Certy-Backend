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
  tableName: 'user_certificates',
  underscored: true,
})
export class UserCertificate extends Model {
  @Column({ type: DataType.INTEGER, field: 'user_id', primaryKey: true })
  userId: number;

  @Column({ type: DataType.STRING, field: 'cert_id', primaryKey: true })
  certId: string;

  @Column({ type: DataType.STRING, field: 'owner_id' })
  ownerId: string;

  @Column({ type: DataType.STRING, field: 'title' })
  title: string;

  @Column({ type: DataType.STRING, field: 'description' })
  description: string;

  @Column({ type: DataType.STRING, field: 'media' })
  media: string;
  
  @Column({ type: DataType.STRING, field: 'metadata' })
  metadata: string;

  @CreatedAt
  @Column({ type: DataType.BIGINT, field: 'issued_at' })
  issuedAt: number;

  @CreatedAt
  @Column({ type: DataType.BIGINT, field: 'created_at' })
  createdAt: number;

  @UpdatedAt
  @Column({ type: DataType.BIGINT, field: 'updated_at' })
  updatedAt: number;

  @BeforeCreate
  static updateTimeWhenCreated(instance: UserCertificate) {
    instance.createdAt = Math.floor(Date.now());
    instance.updatedAt = Math.floor(Date.now());
  }

  @BeforeUpdate
  static updateTimeWhenUpdated(instance: UserCertificate) {
    instance.setDataValue('updatedAt', Math.floor(Date.now()));
  }

  @BeforeBulkUpdate
  static updateTimeWhenBulkUpdate(instances: any[]) {
    instances.forEach((instance) => {
      instance.attributes.updatedAt = Math.floor(Date.now());
    });
  }

  @BeforeBulkCreate
  static updateTimeWhenBulkCreate(instances: any[], options) {
    instances.forEach((instance) => {
      instance.createdAt = Math.floor(Date.now());
    });
  }
}
