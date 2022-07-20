import { Body, HttpCode, Post, Get, Param, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { Request } from 'express';
import { ApiController } from '../../decorators';
import { KycService } from './kyc.service';
import ResHelper from '../../helpers/response.helper';
import { FinishVerificationDto, StartVerificationDto } from './dto/verification.dto';

@ApiController('kyc')
@ApiBearerAuth()
export class KycController {
  constructor(private kycService: KycService) {}

  @Get('verification/latest')
  @HttpCode(200)
  @ApiResponse({ status: 200 })
  async getLatestVerificationSession(@Req() req: Request) {
    const { user } = req;
    const session = await this.kycService.getLatestVerificationSession(user.userId);
    return ResHelper.sendSuccess({
      session
    });
  }

  @Get('verification/status')
  @HttpCode(200)
  @ApiResponse({ status: 200 })
  async getVerificationStatus(@Req() req: Request) {
    const { user } = req;
    const status = await this.kycService.getVerificationStatus(user.userId);
    return ResHelper.sendSuccess(status);
  }

  @Post('verification/start')
  @HttpCode(200)
  @ApiResponse({ status: 200 })
  async startVerification(@Req() req: Request, @Body() payload: StartVerificationDto) {
    const { user } = req;
    const result = await this.kycService.startVerification(user.userId, payload.ref, payload.token);
    return ResHelper.sendSuccess(result);
  }

  @Post('verification/finish')
  @HttpCode(200)
  @ApiResponse({ status: 200 })
  async finishVerification(@Req() req: Request, @Body() payload: FinishVerificationDto) {
    const { user } = req;
    const result = await this.kycService.finishVerification(user.userId, payload.jobId, payload.jobToken);
    return ResHelper.sendSuccess(result);
  }
}
