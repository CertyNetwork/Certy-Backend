import * as dotenv from 'dotenv';
dotenv.config();
export default {
  ACCESS_KEY_ID: process.env.S3_ACCESS_KEY_ID || 'AKIA35ZVIFX2B6ELPE7M',
  SECRET_KEY: process.env.S3_SECRET_ACCESS_KEY || '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',
  REGION: process.env.S3_REGION || '',
  BUCKET_NAME: process.env.S3_BUCKET_NAME || 'certy-private',
  PUBLIC_BUCKET_NAME: process.env.S3_PUBLIC_BUCKET_NAME || 'certy',
  IMAGE_FOLDER: process.env.S3_IMAGE_FOLDER || '',
};
