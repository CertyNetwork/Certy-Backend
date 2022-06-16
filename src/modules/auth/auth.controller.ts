import { Body, HttpCode, Post, Get, Param } from '@nestjs/common';
import { ApiController } from '../../decorators';
import { ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto, RefreshTokenDto } from './dto/login.dto';
import ResHelper from '../../helpers/response.helper';
import { Public } from 'src/decorators/public.decorator';

@ApiController('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('get-nonce/:address')
  @HttpCode(200)
  @ApiResponse({ status: 200 })
  @Public()
  async getNonce(@Param('address') address: string) {
    const nonce = await this.authService.getUserNonce(address);
    return ResHelper.sendSuccess({
      nonce
    });
  }

  @Post('/')
  @HttpCode(200)
  @ApiResponse({ status: 200 })
  @Public()
  async authenticate(@Body() payload: LoginDto) {
    const data = await this.authService.authenticate(payload);
    return ResHelper.sendSuccess({
      ...data
    });
  }

  @Post('/refresh-token')
  @HttpCode(200)
  @ApiResponse({ status: 200 })
  @Public()
  async refreshToken(@Body() payload: RefreshTokenDto) {
    const data = await this.authService.refreshToken(payload.refreshToken);
    return ResHelper.sendSuccess({
      ...data
    });
  }
}
