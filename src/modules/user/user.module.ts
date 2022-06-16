import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { CqrsModule } from '@nestjs/cqrs';

@Module({
  controllers: [],
  providers: [UserService],
  imports: [CqrsModule],
  exports: [UserService],
})
export class UserModule {}
