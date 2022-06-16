import * as dotenv from 'dotenv';

dotenv.config();
const redisConfig = {
  REDIS_CLUSTER: Number(process.env.REDIS_CLUSTER) || 0,
  REDIS_HOST: process.env.REDIS_HOST,
  REDIS_PORT: Number(process.env.REDIS_PORT) || 6379,
  REDIS_PASSWORD: process.env.REDIS_PASSWORD,
  REDIS_DB: Number(process.env.REDIS_DB),
  REDIS_PREFIX: process.env.REDIS_PREFIX || '',
};
export default redisConfig;
