import { connect, keyStores, utils, Contract } from 'near-api-js';

const config = {
  networkId: 'testnet',
  keyStore: new keyStores.InMemoryKeyStore(),
  nodeUrl: 'https://rpc.testnet.near.org',
  walletUrl: 'https://wallet.testnet.near.org',
  headers: {},
};

const main = async () => {
  const near = await connect(config);
  const account = await near.account("edricngo.testnet");
  const contract = new Contract(
    account, // the account object that is connecting
    'cert.certynetwork.testnet',
    {
      // name of contract you're connecting to
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
  console.log(tokens);
};

main().then(() => {
  console.log('DONE');
}).catch(e => console.log(e)).finally(
  () => process.exit(0)
);