import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { InjectModel } from '@nestjs/sequelize';
import { getStorage } from 'firebase-admin/storage';
import { CertyError } from 'errors/certy.error';
import { UserEducation } from 'models/user-education';
import { UserExperience } from 'models/user-experience';
import { UserProfile } from 'models/user-profile.model';
import { User } from 'models/user.model';
import { UserEducationDto } from './dto/user-education.dto';
import { UserExperienceDto } from './dto/user-experience.dto';
import { OrganizationInfoDto, UserInfoDto } from './dto/user-info.dto';
import { UserDocument } from 'models/user-documents';
import { OrganizationProfile } from 'models/organization-profile.model';
import { UserAboutDto, UserSkillsDto } from './dto/user-about.dto';
import { UserCertificate } from 'models/user-certificate.model';
import { UserCertDto } from './dto/user-cert.dto';

@Injectable()
export class ProfileService {
  constructor(
    protected commandBus: CommandBus,
    @InjectModel(UserExperience)
    private readonly userExperienceModel: typeof UserExperience,
    @InjectModel(UserEducation)
    private readonly userEducationModel: typeof UserEducation,
    @InjectModel(UserProfile)
    private readonly userProfileModel: typeof UserProfile,
    @InjectModel(OrganizationProfile)
    private readonly organizationProfileModel: typeof OrganizationProfile,
    @InjectModel(UserDocument)
    private readonly userDocumentModel: typeof UserDocument,
    @InjectModel(User)
    private readonly userModel: typeof User,
    @InjectModel(UserCertificate)
    private readonly userCertificateModel: typeof UserCertificate,
  ) {

  }

  public async changeUserType(userId, type: 'individual' | 'institution') {
    this.userModel.update({
      userType: type,
    }, {
      where: { id: userId }
    });
    return {
      status: 'OK'
    };
  }

  public async getMyUserType(userId) {
    const userEntity = await this.userModel.findOne({
      where: { id: userId }
    });
    
    if (!userEntity) {
      throw new CertyError('Invalid user');
    }

    return {
      userType: userEntity.userType
    }
  }

  public async getMyProfile(userId) {
    const userEntity = await this.userModel.findOne({
      where: { id: userId }
    });

    if (!userEntity) {
      return null;
    }

    if (userEntity.userType === 'individual') {
      const [info, experiences, educations, certificates] = await Promise.all([
        this.userProfileModel.findOne({
          where: {
            userId: userId
          }
        }),
        this.userExperienceModel.findAll({
          where: {
            userId: userId
          }
        }),
        this.userEducationModel.findAll({
          where: {
            userId: userId
          }
        }),
        this.userCertificateModel.findAll({
          where: {
            userId: userId
          }
        })
      ]);
      return {
        info: info ? {
          email: info.email,
          displayName: info.displayName,
          location: info.location,
          bio: info.bio,
          linkedInLink: info.linkedInLink,
          githubLink: info.githubLink,
        } : null,
        experiences: experiences.map(ex => ({
          id: ex.id,
          companyName: ex.companyName,
          title: ex.title,
          location: ex.location,
          employmentType: ex.employmentType,
          description: ex.description,
          startDate: ex.startDate,
          endDate: ex.endDate,
        })),
        educations: educations.map(ed => ({
          id: ed.id,
          school: ed.school,
          degree: ed.degree,
          grade: ed.grade,
          fieldOfStudy: ed.fieldOfStudy,
          description: ed.description,
          startDate: ed.startDate,
          endDate: ed.endDate,
        })),
        skills: info && info.skills ? JSON.parse(info.skills) : [],
        about: info? info.about : null,
        certificates: certificates.map(ct => ({
          id: ct.certId
        }))
      }
    }
    
    const [info, documents] = await Promise.all([
      this.organizationProfileModel.findOne({
        where: {
          userId: userId
        }
      }),
      this.userDocumentModel.findAll({
        where: {
          userId: userId,
          documentType: 'organization-images'
        }
      }),
    ]);

    const companyImages = await Promise.all(documents.map(doc => this.getDocUri(doc.documentUri)));

    return {
      info: info ? {
        id: info.id,
        companyName: info.companyName,
        email: info.email,
        location: info.location,
        organizationSize: info.organizationSize,
        organizationType: info.organizationType,
        workingHours: info.workingHours,
      } : null,
      images: documents.map((doc, idx) => ({
        id: doc.id,
        src: companyImages[idx]
      })),
      about: info?.about
    }
  }

  public async getPublicProfile(accountId: string) {
    const userEntity = await this.userModel.findOne({
      where: { address: accountId }
    });

    if (!userEntity) {
      return null;
    }

    if (userEntity.userType === 'individual') {
      const [info, experiences, educations, certificates] = await Promise.all([
        this.userProfileModel.findOne({
          where: {
            userId: userEntity.id
          }
        }),
        this.userExperienceModel.findAll({
          where: {
            userId: userEntity.id
          }
        }),
        this.userEducationModel.findAll({
          where: {
            userId: userEntity.id
          }
        }),
        this.userCertificateModel.findAll({
          where: {
            userId: userEntity.id
          }
        })
      ]);
      return {
        userType: userEntity.userType,
        profile: {
          info: {
            displayName: info?.displayName,
            location: info?.location,
            linkedInLink: info?.linkedInLink,
            githubLink: info?.githubLink,
          },
          experiences: experiences.map(ex => ({
            companyName: ex.companyName,
            title: ex.title,
            employmentType: ex.employmentType,
            description: ex.description,
            startDate: ex.startDate,
            endDate: ex.endDate,
          })),
          educations: educations.map(ed => ({
            school: ed.school,
            degree: ed.degree,
            grade: ed.grade,
            fieldOfStudy: ed.fieldOfStudy,
            description: ed.description,
            startDate: ed.startDate,
            endDate: ed.endDate,
          })),
          skills: info?.skills ? JSON.parse(info.skills) : [],
          about: info?.about,
          certificates: certificates.map(ct => ({
            id: ct.certId
          }))
        }
      };
    }
    
    const [info, documents] = await Promise.all([
      this.organizationProfileModel.findOne({
        where: {
          userId: userEntity.id
        }
      }),
      this.userDocumentModel.findAll({
        where: {
          userId: userEntity.id,
          documentType: 'organization-images'
        }
      }),
    ]);

    const companyImages = await Promise.all(documents.map(doc => this.getDocUri(doc.documentUri)));

    return {
      userType: userEntity.userType,
      profile: {
        info: info ? {
          id: info.id,
          companyName: info.companyName,
          email: info.email,
          location: info.location,
          organizationSize: info.organizationSize,
          organizationType: info.organizationType,
          workingHours: info.workingHours,
        } : null,
        images: documents.map((doc, idx) => ({
          id: doc.id,
          src: companyImages[idx]
        })),
        about: info?.about
      }
    }
  }

  public async updateAboutMe(userId, payload: UserAboutDto) {
    const userEntity = await this.userModel.findOne({
      where: { id: userId }
    });

    if (!userEntity) {
      throw new CertyError('Invalid operation');
    }

    let profileEntity;

    if (userEntity.userType === 'individual') {
      profileEntity = await this.userProfileModel.findOne({
        where: {
          userId: userId
        }
      });
    } else {
      profileEntity = await this.organizationProfileModel.findOne({
        where: {
          userId: userId
        }
      });
    }
  
    if (profileEntity) {
      profileEntity.about = payload.about;
      await profileEntity.save();
      return {status: 'OK'};
    }

    if (userEntity.userType === 'individual') {
      await this.userProfileModel.create({
        userId: userId,
        about: payload.about,
      });
    } else {
      await this.organizationProfileModel.create({
        userId: userId,
        about: payload.about,
      });
    }

    return {status: 'OK'};
  }

  public async updateUserInfo(userId, infoDto: UserInfoDto) {
    const userEntity = await this.userModel.findOne({
      where: { id: userId }
    });

    if (!userEntity || userEntity.userType !== 'individual') {
      throw new CertyError('Invalid operation');
    }

    let infoEntity = await this.userProfileModel.findOne({
      where: { userId: userId }
    });
    if (!infoEntity) {
      infoEntity = await this.userProfileModel.create({
        userId: userId,
        bio: infoDto.bio,
        email: infoDto.email,
        location: infoDto.location,
        linkedInLink: infoDto.linkedinLink,
        githubLink: infoDto.githubLink,
        displayName: infoDto.displayName
      });
    } else {
      infoEntity.bio = infoDto.bio;
      infoEntity.email = infoDto.email;
      infoEntity.location = infoDto.location;
      infoEntity.linkedInLink = infoDto.linkedinLink;
      infoEntity.githubLink = infoDto.githubLink;
      infoEntity.displayName = infoDto.displayName;
      await infoEntity.save();
    }

    return {
      status: 'OK'
    };
  }

  public async updateOrganizationInfo(userId, infoDto: OrganizationInfoDto) {
    await this.assertOrganizationOperation(userId);

    let infoEntity = await this.organizationProfileModel.findOne({
      where: { userId: userId }
    });
    if (!infoEntity) {
      infoEntity = await this.organizationProfileModel.create({
        userId: userId,
        email: infoDto.email,
        companyName: infoDto.companyName,
        location: infoDto.location,
        organizationType: infoDto.organizationType,
        workingHours: infoDto.workingHours,
        organizationSize: infoDto.organizationSize
      });
    } else {
      infoEntity.email = infoDto.email;
      infoEntity.location = infoDto.location;
      infoEntity.organizationType = infoDto.organizationType;
      infoEntity.workingHours = infoDto.workingHours;
      infoEntity.organizationSize = infoDto.organizationSize;
      await infoEntity.save();
    }

    return {
      status: 'OK'
    };
  }

  public async updateExperiences(userId, experienceDto: UserExperienceDto) {
    await this.assertIndividualUserOperation(userId);

    if (experienceDto.id) {
      const experienceEntity = await this.userExperienceModel.findOne({
        where: { id: experienceDto.id, userId: userId }
      });
      if (!experienceEntity) {
        throw new CertyError('Invalid operation');
      }
      experienceEntity.companyName = experienceDto.company;
      experienceEntity.description = experienceDto.description;
      experienceEntity.industry = experienceDto.industry;
      experienceEntity.location = experienceDto.location;
      experienceEntity.employmentType = experienceDto.employmentType;
      experienceEntity.title = experienceDto.title;
      experienceEntity.startDate = experienceDto.startDate;
      experienceEntity.endDate = experienceDto.endDate;
      await experienceEntity.save();
    } else {
      await this.userExperienceModel.create({
        userId: userId,
        companyName: experienceDto.company,
        title: experienceDto.title,
        startDate: experienceDto.startDate,
        endDate: experienceDto.endDate,
        location: experienceDto.location,
        industry: experienceDto.industry,
        employmentType: experienceDto.employmentType,
        description: experienceDto.description,
      });
    }

    return {
      status: 'OK'
    };
  }

  public async updateEducations(userId, educationDto: UserEducationDto) {
    await this.assertIndividualUserOperation(userId);

    if (educationDto.id) {
      const educationEntity = await this.userEducationModel.findOne({
        where: { id: educationDto.id, userId: userId }
      });
      if (!educationEntity) {
        throw new CertyError('Invalid operation');
      }
     educationEntity.school = educationDto.school;
     educationEntity.description = educationDto.description;
     educationEntity.grade = educationDto.grade;
     educationEntity.degree = educationDto.degree;
     educationEntity.fieldOfStudy = educationDto.fieldOfStudy;
     educationEntity.startDate = educationDto.startDate;
     educationEntity.endDate = educationDto.endDate;
     await educationEntity.save();
    } else {
      await this.userEducationModel.create({
        userId: userId,
        school: educationDto.school,
        description: educationDto.description,
        startDate: educationDto.startDate,
        endDate: educationDto.endDate,
        grade: educationDto.grade,
        degree: educationDto.degree,
        fieldOfStudy: educationDto.fieldOfStudy,
      });
    }

    return {
      status: 'OK'
    };
  }

  public async updateSkills(userId, payload: UserSkillsDto) {
    await this.assertIndividualUserOperation(userId);

    const profileEntity = await this.userProfileModel.findOne({
      where: {
        userId: userId
      }
    });
  
    if (profileEntity) {
      profileEntity.skills = JSON.stringify(payload.skills);
      await profileEntity.save();
      return {status: 'OK'};
    }

    await this.userProfileModel.create({
      userId: userId,
      skills: JSON.stringify(payload.skills),
    });

    return {status: 'OK'};
  }

  public async getAvatarImage(userId: string): Promise<any> {
    try {
      const uri = await this.getDocUri(`profiles/${userId}`);
      
      return {
        src: uri
      }
    } catch (e) {
      throw e;
    }
  }

  public async getBgImage(userId: string): Promise<any> {
    try {
      const uri = await this.getDocUri(`bgImages/${userId}`);
      
      return {
        src: uri
      }
    } catch (e) {
      throw e;
    }
  }

  private async getDocUri(uri: string): Promise<any> {
    try {
      const storage = getStorage();
      const file = storage.bucket().file(uri);
      const [fileExist] = await file.exists();
      if (!fileExist) {
        return '';
      }
      const [docUri] = await file.getSignedUrl({
        action: 'read',
        expires: Date.now() + 1000 * 60 * 60
      });
      
      return docUri;
    } catch (e) {
      return '';
    }
  }

  public async uploadAvatarImage(userId: string, image: Express.Multer.File): Promise<any> {
    try {
      const storage = getStorage();
      const file = storage.bucket().file(`profiles/${userId}`);
      
      await new Promise((rs, rj) => {
        const stream = file.createWriteStream({
          contentType: image.mimetype,
        });
  
        stream.on('error', (err) => {
          rj(err);
        })
      
        stream.on('finish', async () => {
          rs(true);
        });

        stream.end(image.buffer);
      });

      const [avatarUri] = await file.getSignedUrl({
        action: 'read',
        expires: Date.now() + 1000 * 60 * 60
      });
      
      return {
        src: avatarUri
      }
    } catch (e) {
      throw e;
    }
  }

  public async uploadBgImage(userId: string, image: Express.Multer.File): Promise<any> {
    try {
      const storage = getStorage();
      const file = storage.bucket().file(`bgImages/${userId}`);
      
      await new Promise((rs, rj) => {
        const stream = file.createWriteStream({
          contentType: image.mimetype,
        });
  
        stream.on('error', (err) => {
          rj(err);
        })
      
        stream.on('finish', async () => {
          rs(true);
        });

        stream.end(image.buffer);
      });

      const [uri] = await file.getSignedUrl({
        action: 'read',
        expires: Date.now() + 1000 * 60 * 60
      });
      
      return {
        src: uri
      }
    } catch (e) {
      throw e;
    }
  }

  public async removeAvatarImage(userId: string): Promise<any> {
    try {
      const storage = getStorage();
      const file = storage.bucket().file(`profiles/${userId}`);
      await file.delete();
      return {
        status: 'OK'
      };
    } catch (e) {
      throw e;
    }
  }

  public async removeBgImage(userId: string): Promise<any> {
    try {
      const storage = getStorage();
      const file = storage.bucket().file(`bgImages/${userId}`);
      await file.delete();
      return {
        status: 'OK'
      };
    } catch (e) {
      throw e;
    }
  }

  public async uploadDocument(user, documentType: string, document: Express.Multer.File, metadata?: any) {
    try {
      const storage = getStorage();
      const fileUri = `documents/${user.accountId}/${documentType}/${document.originalname}`;
      const file = storage.bucket().file(fileUri);
      
      await new Promise((rs, rj) => {
        const stream = file.createWriteStream({
          contentType: document.mimetype,
        });
  
        stream.on('error', (err) => {
          rj(err);
        })
      
        stream.on('finish', async () => {
          
          await this.userDocumentModel.findOrCreate({
            where: {
              userId: user.userId,
              documentUri: fileUri,
            },
            defaults: {
              userId: user.userId,
              documentType: documentType,
              metadata: JSON.stringify(metadata),
              documentUri: fileUri,
            }
          });
          rs(true);
        });

        stream.end(document.buffer);
      });

      const [fileUrl] = await file.getSignedUrl({
        action: 'read',
        expires: Date.now() + 1000 * 60 * 60
      });
      
      return {
        fileUrl: fileUrl
      }
    } catch (e) {
      throw e;
    }
  }

  public async removeDocument(user, docId: string | number) {
    try {
      const docEntity = await this.userDocumentModel.findOne({
        where: {
          userId: user.userId,
          id: docId
        }
      });
      if (!docEntity) {
        throw new CertyError('Could not found document');
      }
      const storage = getStorage();
      const file = storage.bucket().file(docEntity.documentUri);

      await file.delete({
        ignoreNotFound: true
      });

      await docEntity.destroy();

      return {
        status: 'OK'
      }
    } catch (e) {
      throw e;
    }
  }

  public async updateCertificates(userId, { certs }: UserCertDto) {
    // destroy all
    await this.userCertificateModel.destroy({
      where: {
        userId: userId
      }
    });
    // re-add
    if (certs && certs.length) {
      await this.userCertificateModel.bulkCreate(certs.map(cert => ({
        userId: userId,
        certId: cert,
      })), {
        ignoreDuplicates: true
      });
    }

    return {
      status: 'OK'
    }
  }

  private async assertIndividualUserOperation(userId) {
    const userEntity = await this.userModel.findOne({
      where: { id: userId }
    });

    if (!userEntity || userEntity.userType !== 'individual') {
      throw new CertyError('Invalid operation');
    }
  }

  private async assertOrganizationOperation(userId) {
    const userEntity = await this.userModel.findOne({
      where: { id: userId }
    });

    if (!userEntity || userEntity.userType !== 'institution') {
      throw new CertyError('Invalid operation');
    }
  }
}
