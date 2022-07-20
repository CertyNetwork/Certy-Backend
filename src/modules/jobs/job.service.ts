import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { CertyError } from 'errors/certy.error';
import { ApplyJobDto, UpdateApplicantStatusDto } from './dto/job.dto';
import { Applicant } from 'models/applicant.model';
import { User } from 'models/user.model';
import { getStorage } from 'firebase-admin/storage';

@Injectable()
export class JobService {
  constructor(
    protected commandBus: CommandBus,
    @InjectModel(Applicant)
    private readonly applicantModel: typeof Applicant,
    @InjectModel(User)
    private readonly userModel: typeof User,
  ) {

  }

  async applyForJob(userId: number, files: Array<Express.Multer.File>, payload: ApplyJobDto) {
    const existingApplicant = await this.applicantModel.findOne(
      {
        where: {
          applicantId: userId,
          jobId: payload.jobId
        }
      }
    );
    if (existingApplicant) {
      throw new CertyError('The job has been applied already'); 
    }
    
    const supportedDocTypes = ['resume', 'coverLetter'];
    if (files && files.length) {
      const storage = getStorage();
      for(const file of files) {
        const docType = file.fieldname;
        if (supportedDocTypes.indexOf(docType) < 0) {
          continue;
        }
        const fileUri = this.getJobFileUri(userId, payload.jobId, file.fieldname)
        const fileRef = storage.bucket().file(fileUri);
      
        await new Promise((rs, rj) => {
          const stream = fileRef.createWriteStream({
            contentType: file.mimetype,
          });
    
          stream.on('error', (err) => {
            rj(err);
          })
        
          stream.on('finish', async () => {
            rs(true);
          });
  
          stream.end(file.buffer);
        });
        if (docType === 'resume') {
          payload.resumeUrl = fileUri;
        }
        if (docType === 'coverLetter') {
          payload.coverLetter = fileUri;
        }
      }
    }

    const recruiter = await this.userModel.findOne({
      where: {
        address: payload.recruiterAccountId
      }
    });

    if (!recruiter) {
      throw new CertyError('Could not found job owner'); 
    }

    if (recruiter.id == userId) {
      throw new CertyError('Invalid job application'); 
    }

    await this.applicantModel.create({
      applicantId: userId,
      recruiterId: recruiter.id,
      jobId: payload.jobId,
      contactEmail: payload.contactEmail,
      contactNumber: payload.contactNumber,
      resumeUrl: payload.resumeUrl,
      coverLetter: payload.coverLetter
    });

    return {
      status: 'applied'
    }
  }

  async getJobCandidates(userId: number, jobId: string) {
    const applicants = await this.applicantModel.findAll({
      where: {
        recruiterId: userId,
        jobId: jobId
      }
    });

    const applicantIds = applicants.map(a => a.applicantId);
    const users = await this.userModel.findAll({
      where: {
        id: { [Op.in]: applicantIds }
      }
    });
    return users.map(u => u.address);
  }

  async updateApplicantStatus(userId: number, jobId: string, payload: UpdateApplicantStatusDto) {
    const applicant = await this.applicantModel.findOne({
      where: {
        jobId: jobId,
        applicantId: payload.applicantId
      }
    });
    if (!applicant) {
      throw new CertyError('Could not found the applicant'); 
    }

    if (applicant.recruiterId !== userId) {
      throw new CertyError('Invalid operation'); 
    }

    applicant.status = payload.status;
    await applicant.save();

    return {
      status: 'updated'
    }
  }

  async getAppliedJobs(userId: number) {
    const applicants = await this.applicantModel.findAll({
      where: {
        applicantId: userId,
      }
    });

    return applicants.map(u => u.jobId);
  }

  private getJobFileUri(userId: string | number, jobId: string, fileType: string) {
    const fileRef = `jobs/${jobId}/${userId}/${fileType}`;
    return fileRef;
  }

  async getJobApplicantDocuments(userId, jobId) {
    const applicant = await this.applicantModel.findOne({
      where: {
        applicantId: userId,
        jobId: jobId,
      }
    });

    if (!applicant) {
      throw new CertyError('Could not found the applicant');
    }

    const [resume, coverLetter] = await Promise.all([
      this.getDoc(applicant.resumeUrl),
      this.getDoc(applicant.coverLetter)
    ]);
    const result = {
      resume,
      coverLetter
    };

    return result;
  }

  private async getDoc(docUri: string): Promise<any> {
    try {
      const storage = getStorage();
      const file = storage.bucket().file(docUri);
      const [uri] = await file.getSignedUrl({
        action: 'read',
        expires: Date.now() + 1000 * 60 * 60
      });
      
      return uri;
    } catch (e) {
      return null;
    }
  }
}
