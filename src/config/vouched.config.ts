import * as dotenv from 'dotenv';
dotenv.config();
const exportObject = {
  VOUCHED_PRIVATE_KEY: process.env.VOUCHED_PRIVATE_KEY || '',
};
export default exportObject;