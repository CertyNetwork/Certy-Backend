import * as dotenv from 'dotenv';
dotenv.config();

let twoFaIssuer;
const env: string = process.env.NODE_ENV;
if (env === 'production') {
  twoFaIssuer = 'Certy';
} else if (env === 'stage') {
  twoFaIssuer = 'Certy-Dev';
} else {
  twoFaIssuer = 'Certy-Local';
}

const exportObject = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  CORS_ORIGIN: process.env.CORS_ORIGIN || '*',
  REDIS_CLUSTER: Number(process.env.REDIS_CLUSTER) || 0,
  LOGO_URL: '',
  APP_URL: process.env.APP_URL,
  JWT_SECRET_KEY: process.env.JWT_SECRET_KEY || 'certy-secret',
  REFRESH_TOKEN_LIFE_TIME: process.env.REFRESH_TOKEN_LIFE_TIME || '30d',
  ENCRYPTION_KEY: process.env.ENCRYPTION_KEY, // must length equal 32
  TWO_FA_ISSUER: twoFaIssuer,
  NEAR_NODE_URL: process.env.NEAR_NODE_URL || 'https://rpc.testnet.near.org',
};
export default exportObject;
