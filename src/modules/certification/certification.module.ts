import { Module } from '@nestjs/common';
import { CertificationService } from './certification.service';
import { CqrsModule } from '@nestjs/cqrs';
import { connect, keyStores } from 'near-api-js';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserCertificate } from 'models/user-certificate.model';

@Module({
  controllers: [],
  providers: [
    CertificationService,
    {
      provide: 'NEAR',
      useFactory: async () => {
        const config = {
          networkId: process.env.NEAR_NETWORK_ID,
          keyStore: new keyStores.InMemoryKeyStore(),
          nodeUrl: process.env.NEAR_NODE_URL,
          walletUrl: process.env.NEAR_WALLET_URL,
          headers: {},
        };
        const near = await connect(config);
        
        return near;
      },
    }
  ],
  imports: [
    CqrsModule,
    SequelizeModule.forFeature([UserCertificate]),
  ],
  exports: [CertificationService],
})
export class CertificationModule {}
