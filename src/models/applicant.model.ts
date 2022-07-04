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
  tableName: 'applicants',
  underscored: true,
})
export class Applicant extends Model {
  id: bigint;

  @Column({ type: DataType.INTEGER, field: 'applicant_id' })
  applicantId: number;

  @Column({ type: DataType.INTEGER, field: 'recruiter_id' })
  recruiterId: number;

  @Column({ type: DataType.INTEGER, field: 'job_id'})
  jobId: string;

  @Column({ type: DataType.STRING, field: 'contact_email'})
  contactEmail: string;

  @Column({ type: DataType.STRING, field: 'contact_number'})
  contactNumber: string;

  @Column({ type: DataType.STRING, field: 'resume_url'})
  resumeUrl: string;

  @Column({ type: DataType.STRING, field: 'cover_letter'})
  coverLetter: string;

  @Column({ type: DataType.ENUM('un_reviewed', 'reviewed'), field: 'status'})
  status: string;
  
  @CreatedAt
  @Column({ type: DataType.BIGINT, field: 'created_at' })
  createdAt: number;

  @UpdatedAt
  @Column({ type: DataType.BIGINT, field: 'updated_at' })
  updatedAt: number;

  @BeforeCreate
  static updateTimeWhenCreated(instance: Applicant) {
    instance.createdAt = Math.floor(Date.now());
    instance.updatedAt = Math.floor(Date.now());
  }

  @BeforeUpdate
  static updateTimeWhenUpdated(instance: Applicant) {
    instance.setDataValue('updatedAt', Math.floor(Date.now()));
  }

  @BeforeBulkUpdate
  @BeforeBulkCreate
  static updateTimeWhenBulk(instance) {
    instance.attributes.updatedAt = Math.floor(Date.now());
  }
}
