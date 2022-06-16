import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { JwtService, JwtVerifyOptions } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/sequelize';
import { providers, utils } from 'near-api-js';
import { v4 as uuidv4 } from 'uuid';
import { CertyError } from 'src/errors/cerrty.error';
import { User } from '../../models/user.model';
import { LoginDto } from './dto/login.dto';
import { AccountView } from 'near-api-js/lib/providers/provider';
import commonConfig from '../../config/common.config';
import { AuthCacheService } from '../cache-management/auth-cache.service';

@Injectable()
export class AuthService {
  provider = new providers.JsonRpcProvider(commonConfig.NEAR_NODE_URL);

  constructor(
    protected commandBus: CommandBus,
    @InjectModel(User)
    private readonly userModel: typeof User,
    private jwtService: JwtService,
    private authCacheService: AuthCacheService
  ) {}

  async getUserNonce(address: string) {
    let user = await this.userModel.findOne({
      where: { address }
    });
    if (!user) {
      const isValidAccount = await this.isValidAccountId(address);
      if (!isValidAccount) {
        throw new CertyError('Invalid account id');
      }
      user = await this.userModel.create({
        address,
      });
    } else {
      user.nonce = uuidv4();
      await user.save();
    }

    return user.nonce;
  }

  async authenticate(payload: LoginDto) {
    const { accountId, publicKey: pub, signature} = payload;
    let user = await this.userModel.findOne({
      where: { address: accountId }
    });
    if (!user) {
      throw new CertyError('Invalid credentials');
    }
    const publicKey = utils.key_pair.PublicKey.from(pub);
    const message = Buffer.from(user.nonce);
    const isMatch = publicKey.verify(message, Buffer.from(signature, 'base64'));
    if (!isMatch) {
      throw new CertyError('Invalid credentials');
    }

    user.nonce = uuidv4();
    await user.save();

    const result = {
      accessToken: this.generateToken({
        userId: user.id,
        pub,
        accountId: accountId
      }),
      refreshToken: this.generateRefreshToken({
        userId: user.id,
      }),
    };

    this.authCacheService.registerAccessToken(user.id, result.refreshToken, result.accessToken);

    return result;
  }

  public async refreshToken(refreshToken: string) {
    const decodedInfo = this.decodeToken(refreshToken);
    if (!decodedInfo || !decodedInfo.userId) {
      throw new CertyError('Refresh token is invalid or expired.');
    }

    const user = await this.userModel.findOne({
      where: {
        id: decodedInfo.userId,
      },
    });

    if (!user) {
      throw new CertyError('Invalid refresh token.', 400);
    }

    const currentAccessToken = await this.authCacheService.getAccessToken(user.id, refreshToken);
    if (currentAccessToken) {
      const info = this.decodeToken(currentAccessToken);
      const timeInSec = Date.now() / 1000 >> 0;
      const remainTime = info.exp - timeInSec;
      
      if (remainTime > 0) {
        this.authCacheService.setTokenLogOut(currentAccessToken, remainTime);
      }
    }

    const accessToken = this.generateToken({
      userId: user.id,
      accountId: user.address
    });

    this.authCacheService.registerAccessToken(user.id, refreshToken, accessToken);

    return {
      accessToken,
    };
  }

  private generateToken(data) {
    return this.jwtService.sign(data);
  }

  public generateRefreshToken(data) {
    return this.jwtService.sign(data, {
      expiresIn: '30d'
    });
  }

  public verifyToken(token, options?: JwtVerifyOptions) {
    return this.jwtService.verify(token, options);
  }

  public decodeToken(token): any {
    try {
      return this.jwtService.verify(token);
    } catch (e) {
      return false;
    }
  }

  public async isValidAccountId(accountId: string) {
    try {
      const accountInfo = await this.provider.query<AccountView>({
        request_type: "view_account",
        account_id: accountId,
        finality: "final",
      });
      return !!accountInfo;
    } catch (e) {
      return false;
    }
  }
}
