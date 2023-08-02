import { config } from 'dotenv';

config();

export const databaseConfig = () => ({
  db: {
    host: process.env.MONGODB_HOST,
    port: process.env.MONGODB_PORT,
    name: process.env.MONGODB_DATABASE,
  },
  secret_jwt: process.env.SECRET_JWT,
  expire_jwt: process.env.EXPIRE_JWT,
});
