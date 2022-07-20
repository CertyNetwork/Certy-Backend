import { Inject, Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { InjectModel } from '@nestjs/sequelize';
import { UserCertificate } from 'models/user-certificate.model';
import { Contract, Near } from 'near-api-js';

@Injectable()
export class CertificationService {
  constructor(
    protected commandBus: CommandBus,
    @Inject('NEAR')
    private readonly near: Near,
    @InjectModel(UserCertificate)
    private readonly userCertificateModel: typeof UserCertificate,
  ) {
    
  }

  async pullCertificate({id: userId, address: accountId}: any) {
    try {
      const account = await this.near.account(accountId);
      const contract = new Contract(
        account,
        process.env.CERTY_SMART_CONTRACT,
        {
          viewMethods: [
            "nft_tokens",
            "nft_token",
            "nft_tokens_for_owner",
            "nft_supply_for_owner",
            'categories_for_owner',
            'category_info',
            'cert_get_by_category',
    
          ], // view methods
          changeMethods: [
            "nft_mint",
            'nft_bulk_mint',
            "nft_transfer",
            'category_create',
            'category_update',
            'cert_update'
          ], // change methods
        }
      );
      // @ts-ignore: method does not exist on Contract type
      const tokens = await contract.nft_tokens_for_owner({
        account_id: account.accountId
      });

      if (tokens && tokens.length) {
        await this.userCertificateModel.bulkCreate(tokens.map(tk => ({
          userId,
          certId: tk.token_id,
          ownerId: tk.owner_id,
          title: tk.metadata.title,
          description: tk.metadata.description,
          media: tk.metadata.media,
          issuedAt: tk.metadata.issued_at,
          metadata: JSON.stringify(tk.metadata),
        })), {
          ignoreDuplicates: true
        });
      }
    } catch(e) {
      console.log(e);
    }

    return true;
  }
}