import { Body, HttpCode, Post, Get, Param, Req, UseInterceptors, UploadedFile, UploadedFiles } from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiConsumes, ApiResponse } from '@nestjs/swagger';
import { CertyError } from 'errors/certy.error';
import { Request } from 'express';
import { ApiController } from '../../decorators';
import ResHelper from '../../helpers/response.helper';
import { Web3StorageService } from './web3.storage.service';

@ApiController('web3-storage')
@ApiBearerAuth()
export class StorageController {
  constructor(private storageService: Web3StorageService) {

  }

  @Post('put-files')
  @HttpCode(200)
  @ApiConsumes('multipart/form-data')
  @ApiResponse({ status: 200 })
  @UseInterceptors(FilesInterceptor('files', 10, {
    limits: {
      fileSize: 10485760, // 10MB
      files: 10,
    },
    // fileFilter: (req, file, cb) => {
    //   if (file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
    //     cb(null, true);
    //   } else {
    //     cb(
    //       new CertyError(
    //         'The image format is not valid only jpg, png are accepted',
    //       ),
    //       false,
    //     );
    //   }
    // },
  }))
  async putMany(@UploadedFiles() files: Array<Express.Multer.File>, @Req() req: Request, @Body() metadata) {
    if (!files || !files.length) {
      return ResHelper.sendFail('Invalid operation');
    }
    const { user } = req;
    const result = await this.storageService.putFiles(user.userId, files, metadata)
    return ResHelper.sendSuccess(result);
  }
}
