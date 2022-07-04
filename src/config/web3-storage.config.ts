import * as dotenv from 'dotenv';
dotenv.config();
const exportObject = {
  API_KEY: process.env.WEB3_STORAGE_API_KEY || '',
};
export default exportObject;