import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { UserStorage } from 'models/user-storage.model';
import { ReadStream } from 'typeorm/platform/PlatformTools';
import { Web3Storage } from 'web3.storage';
import Web3StorageConfig from '../../config/web3-storage.config';

@Injectable()
export class Web3StorageService {
  client: Web3Storage;
  
  constructor(
    @InjectModel(UserStorage)
    private readonly storageModel: typeof UserStorage,
  ) {
    this.client = new Web3Storage({ token: Web3StorageConfig.API_KEY });
  }

  async putFiles(userId: number, files: Array<Express.Multer.File>, metaData?: any): Promise<any> {
    const uploadFiles = files.map(file => ({
        name: file.originalname,
        stream: () => ReadStream.from(file.buffer)
      })
    );

    const rootCid = await this.client.put(uploadFiles);

    if (rootCid) {
      const isContentIdExist = await this.storageModel.findOne({
        where: {
          rootCid: rootCid,
        }
      });
      if (!isContentIdExist) {
        await this.storageModel.create({
          userId: userId,
          files: JSON.stringify(uploadFiles.map(file => file.name)),
          rootCid: rootCid.valueOf(),
          metaData: metaData ? JSON.stringify(metaData) : null
        });
      }
    }

    return {
      rootCid: rootCid.toString(),
      files: await this.client.get(rootCid),
    };
  }

  async getFiles(rootCid: string) {
    const res = await this.client.get(rootCid);
    const files = await res.files();
    for (const file of files) {
      console.log(`${file.cid}`);
    }
  }
}



