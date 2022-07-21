import { Body, HttpCode, Post, Get, Req, UseInterceptors, UploadedFile, Delete, Param } from '@nestjs/common';
import { ApiBearerAuth, ApiConsumes, ApiResponse } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';
import { ApiController } from '../../decorators';
import ResHelper from '../../helpers/response.helper';
import { ProfileService } from './profile.service';
import { UserExperienceDto } from './dto/user-experience.dto';
import { UserEducationDto } from './dto/user-education.dto';
import { OrganizationInfoDto, UserInfoDto } from './dto/user-info.dto';
import { UserTypeDto } from './dto/user-type.dto';
import { UploadDocumentDto } from './dto/upload-document.dto';
import { UserAboutDto, UserSkillsDto } from './dto/user-about.dto';
import { UserCertDto } from './dto/user-cert.dto';
import { CertyError } from 'errors/certy.error';
import { Public } from 'decorators/public.decorator';

@ApiBearerAuth()
@ApiController('profile')
export class ProfileController {
  constructor(
    private profileService: ProfileService
  ) {}

  @Get('/type')
  @HttpCode(200)
  @ApiResponse({ status: 200 })
  async getMyUserType(@Req() req: Request) {
    const { user } = req;
    const result = await this.profileService.getMyUserType(user.userId);
    return ResHelper.sendSuccess({
      ...result
    });
  }

  @Get('/me')
  @HttpCode(200)
  @ApiResponse({ status: 200 })
  async getMyProfile(@Req() req: Request) {
    const { user } = req;
    const profile = await this.profileService.getMyProfile(user.userId);
    return ResHelper.sendSuccess({
      ...profile
    });
  }

  @Post('/me')
  @HttpCode(200)
  @ApiResponse({ status: 200 })
  async changeType(@Req() req: Request, @Body() payload: UserTypeDto) {
    const { user } = req;
    const result = await this.profileService.changeUserType(user.userId, payload.userType);
    return ResHelper.sendSuccess({
      ...result
    });
  }

  @Post('/me/about')
  @HttpCode(200)
  @ApiResponse({ status: 200 })
  async updateAbout(@Req() req: Request, @Body() payload: UserAboutDto) {
    const { user } = req;
    const profile = await this.profileService.updateAboutMe(user.userId, payload);
    return ResHelper.sendSuccess({
      profile
    });
  }

  @Post('/me/individual-info')
  @HttpCode(200)
  @ApiResponse({ status: 200 })
  async updateInfo(@Req() req: Request, @Body() payload: UserInfoDto) {
    const { user } = req;
    const result = await this.profileService.updateUserInfo(user.userId, payload);
    return ResHelper.sendSuccess({
      ...result
    });
  }

  @Post('/me/organization-info')
  @HttpCode(200)
  @ApiResponse({ status: 200 })
  async updateOrganizationInfo(@Req() req: Request, @Body() payload: OrganizationInfoDto) {
    const { user } = req;
    const result = await this.profileService.updateOrganizationInfo(user.userId, payload);
    return ResHelper.sendSuccess({
      ...result
    });
  }

  @Post('/me/skills')
  @HttpCode(200)
  @ApiResponse({ status: 200 })
  async updateSkills(@Req() req: Request, @Body() payload: UserSkillsDto) {
    const { user } = req;
    const result = await this.profileService.updateSkills(user.userId, payload);
    return ResHelper.sendSuccess({
      result
    });
  }

  @Post('/me/experiences')
  @HttpCode(200)
  @ApiResponse({ status: 200 })
  async updateExperiences(@Req() req: Request, @Body() payload: UserExperienceDto) {
    const { user } = req;
    const result = await this.profileService.updateExperiences(user.userId, payload);
    return ResHelper.sendSuccess({
      ...result
    });
  }

  @Post('/me/educations')
  @HttpCode(200)
  @ApiResponse({ status: 200 })
  async updateEducations(@Req() req: Request, @Body() payload: UserEducationDto) {
    const { user } = req;
    const result = await this.profileService.updateEducations(user.userId, payload);
    return ResHelper.sendSuccess({
      ...result
    });
  }

  @Get('/avatar/:accountId')
  @Public()
  @HttpCode(200)
  @ApiResponse({ status: 200 })
  async getPublicAvatar(@Param('accountId') accountId: string) {
    const result = await this.profileService.getAvatarImage(accountId);
    return ResHelper.sendSuccess({
      ...result
    });
  }

  @Get('/bg/:accountId')
  @Public()
  @HttpCode(200)
  @ApiResponse({ status: 200 })
  async getPublicBg(@Param('accountId') accountId: string) {
    const result = await this.profileService.getBgImage(accountId);
    return ResHelper.sendSuccess({
      ...result
    });
  }

  @Get('/me/avatar')
  @HttpCode(200)
  @ApiResponse({ status: 200 })
  async getAvatar(@Req() req: Request) {
    const { user } = req;
    const result = await this.profileService.getAvatarImage(user.accountId);
    return ResHelper.sendSuccess({
      ...result
    });
  }
  
  @Post('/me/avatar')
  @HttpCode(200)
  @ApiConsumes('multipart/form-data')
  @ApiResponse({ status: 200 })
  @UseInterceptors(FileInterceptor('file', {
    limits: {
      files: 1,
      fileSize: 10485760, // 10MB
    },
    fileFilter: (req, file, cb) => {
      if (file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
        cb(null, true);
      } else {
        cb(
          new CertyError(
            'The image format is not valid only jpg, png are accepted',
          ),
          false,
        );
      }
    },
  }))
  async uploadAvatar(@UploadedFile() file: Express.Multer.File, @Req() req: Request) {
    if (!file) {
      return ResHelper.sendFail('Invalid operation');
    }
    const { user } = req;
    const result = await this.profileService.uploadAvatarImage(user.accountId, file)
    return ResHelper.sendSuccess({
      ...result
    });
  }

  @Delete('/me/avatar')
  @HttpCode(200)
  @ApiResponse({ status: 200 })
  async deleteAvatar(@Req() req: Request) {
    const { user } = req;
    const result = await this.profileService.removeAvatarImage(user.accountId);
    return ResHelper.sendSuccess({
      ...result
    });
  }

  @Get('/me/bg-image')
  @HttpCode(200)
  @ApiResponse({ status: 200 })
  async getBgImage(@Req() req: Request) {
    const { user } = req;
    const result = await this.profileService.getBgImage(user.accountId);
    return ResHelper.sendSuccess({
      ...result
    });
  }
  
  @Post('/me/bg-image')
  @HttpCode(200)
  @ApiConsumes('multipart/form-data')
  @ApiResponse({ status: 200 })
  @UseInterceptors(FileInterceptor('file', {
    limits: {
      files: 1,
      fileSize: 10485760, // 10MB
    },
    fileFilter: (req, file, cb) => {
      if (file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
        cb(null, true);
      } else {
        cb(
          new CertyError(
            'The image format is not valid only jpg, png are accepted',
          ),
          false,
        );
      }
    },
  }))
  async uploadBgImage(@UploadedFile() file: Express.Multer.File, @Req() req: Request) {
    if (!file) {
      return ResHelper.sendFail('Invalid operation');
    }
    const { user } = req;
    const result = await this.profileService.uploadBgImage(user.accountId, file)
    return ResHelper.sendSuccess({
      ...result
    });
  }

  @Delete('/me/bg-image')
  @HttpCode(200)
  @ApiResponse({ status: 200 })
  async deleteBgImage(@Req() req: Request) {
    const { user } = req;
    const result = await this.profileService.removeBgImage(user.accountId);
    return ResHelper.sendSuccess({
      ...result
    });
  }

  @Post('/me/organization-images')
  @HttpCode(200)
  @ApiConsumes('multipart/form-data')
  @ApiResponse({ status: 200 })
  @UseInterceptors(FileInterceptor('file', {
    limits: {
      files: 1,
      fileSize: 10485760, // 10MB
    },
    fileFilter: (req, file, cb) => {
      if (file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
        cb(null, true);
      } else {
        cb(
          new CertyError(
            'The image format is not valid only jpg, png are accepted',
          ),
          false,
        );
      }
    },
  }))
  async upload(@UploadedFile() file: Express.Multer.File, @Req() req: Request, @Body() payload: UploadDocumentDto) {
    if (!file) {
      return ResHelper.sendFail('Invalid operation');
    }
    const { user } = req;
    const result = await this.profileService.uploadDocument(user, 'organization-images', file, payload)
    return ResHelper.sendSuccess({
      ...result
    });
  }

  @Delete('/me/organization-images/:docId')
  @HttpCode(200)
  @ApiResponse({ status: 200 })
  async removeCompanyImage(@Req() req: Request, @Param('docId') docId: string | number) {
    const { user } = req;
    const result = await this.profileService.removeDocument(user, docId);
    return ResHelper.sendSuccess({
      ...result
    });
  }

  @Get('/public/:userId')
  @Public()
  @HttpCode(200)
  @ApiResponse({ status: 200 })
  async getPublicProfile(@Param('userId') userId: string) {
    const profile = await this.profileService.getPublicProfile(userId);
    return ResHelper.sendSuccess({
      ...profile
    });
  }

  @Post('/me/certificates')
  @HttpCode(200)
  @ApiResponse({ status: 200 })
  async updateCertificates(@Req() req: Request, @Body() payload: UserCertDto) {
    const { user } = req;
    const result = await this.profileService.updateCertificates(user.userId, payload);
    return ResHelper.sendSuccess({
      ...result
    });
  }
}
