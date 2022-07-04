import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserStorage } from 'models/user-storage.model';
import { StorageController } from './web3.storage.controller';
import { Web3StorageService } from './web3.storage.service';

@Module({
  imports: [
    SequelizeModule.forFeature([UserStorage]),
  ],
  controllers: [StorageController],
  providers: [Web3StorageService],
  exports: [Web3StorageService],
})
export class Web3StorageModule {}
