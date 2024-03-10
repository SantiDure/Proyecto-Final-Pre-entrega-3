import dotenv from "dotenv";
dotenv.config();
export const PORT = Number(process.env.PORT);

export const MONGODB_CNX_STR = process.env.MONGODB_CNX_STR;
export const COOKIE_OPTS = {
  signed: true,
  maxAge: 60_000,
  httpOnly: true,
};
export const GITHUB_APP_ID = Number(process.env.GITHUB_APP_ID);
export const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
export const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;
export const GITHUB_CALLBACK_URL =
  "http://localhost:8080/api/sessions/githubcallback";
export const COOKIE_SECRET = process.env.COOKIE_SECRET;
export const JWT_SECRET = process.env.JWT_SECRET;
export const EMAIL = process.env.EMAIL;
export const EMAIL_PASS = process.env.EMAIL_PASS;
