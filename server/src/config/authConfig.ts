import { config } from 'dotenv';
config();

export default {
  secret: process.env.JWT_SECRET as string,
  expiresIn: 1000 * 60 * 60 * 24 * 2,
}

