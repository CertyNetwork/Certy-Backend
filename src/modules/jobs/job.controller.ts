import { Body, HttpCode, Post, Get, Param, Req, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { Request } from 'express';
import { ApiController } from '../../decorators';
import { JobService } from './job.service';
import ResHelper from '../../helpers/response.helper';
import { ApplyJobDto, UpdateApplicantStatusDto } from './dto/job.dto';

@ApiController('job')
@ApiBearerAuth()
export class JobController {
  constructor(private jobService: JobService) {}

  @Post('apply')
  @HttpCode(200)
  @ApiResponse({ status: 200 })
  @UsePipes(new ValidationPipe({ transform: true }))
  async applyJob(@Req() req: Request, @Body() payload: ApplyJobDto) {
    const { user } = req;
    console.log(payload);
    const applyResult = await this.jobService.applyForJob(user.userId, payload);
    return ResHelper.sendSuccess(applyResult);
  }

  @Get(':jobId/candidates')
  @HttpCode(200)
  @ApiResponse({ status: 200 })
  async getJobCandidates(@Req() req: Request, @Param('jobId') jobId: string) {
    const { user } = req;
    const candidates = await this.jobService.getJobCandidates(user.userId, jobId);
    return ResHelper.sendSuccess(candidates);
  }

  @Post(':jobId/update-applicant-status')
  @HttpCode(200)
  @ApiResponse({ status: 200 })
  async updateJobStatus(@Req() req: Request, @Param('jobId') jobId: string, @Body() payload: UpdateApplicantStatusDto) {
    const { user } = req;
    const updateResult = await this.jobService.updateApplicantStatus(user.userId, jobId, payload);
    return ResHelper.sendSuccess(updateResult);
  }

  @Get('get-applied-jobs')
  @HttpCode(200)
  @ApiResponse({ status: 200 })
  async getAppliedJobs(@Req() req: Request) {
    const { user } = req;
    const jobIds = await this.jobService.getAppliedJobs(user.userId);
    return ResHelper.sendSuccess(jobIds);
  }
}
