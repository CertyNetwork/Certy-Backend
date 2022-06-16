import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AUTH_HANDLERS } from './commands';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from '../../models/user.model';
import { CacheModule } from '../cache-management/cache.module';

@Module({
  providers: [AuthService, ...AUTH_HANDLERS],
  imports: [
    CqrsModule,
    CacheModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET_KEY'),
        signOptions: {
          expiresIn: `${configService.get('JWT_EXPIRATION_TIME')}`,
        },
      }),
      inject: [ConfigService],
    }),
    SequelizeModule.forFeature([User]),
  ],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
