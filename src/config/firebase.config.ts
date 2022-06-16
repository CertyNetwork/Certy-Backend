import * as dotenv from 'dotenv';

dotenv.config();
const firebaseConfig = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  privateKey: process.env.FIREBASE_PRIVATE_KEY,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  audience: process.env.FIREBASE_AUDIENCE,
};
export default firebaseConfig;