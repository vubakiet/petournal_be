import dotenv from 'dotenv';

dotenv.config();
export const DB_LINK = process.env.DB_LINK;
export const PORT = process.env.PORT;
export const SECRECT_KEY = process.env.SECRECT_KEY;
export const REFRESH_KEY = process.env.REFRESH_KEY;
export const NEXT_APP_CLIENT = process.env.NEXT_APP_CLIENT;
export const NEXT_APP_ADMIN = process.env.NEXT_APP_ADMIN;
export const SENDMAILUSER = process.env.SENDMAILUSER;
export const SENDMAILPASSWORD = process.env.SENDMAILPASSWORD;

