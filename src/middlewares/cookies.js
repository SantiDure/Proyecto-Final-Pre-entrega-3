import { COOKIE_OPTS } from "../config/config.js";
import { decrypt, encrypt } from "../utils/criptograph.js";

export async function saveTokenInCookie(req, res, next) {
  const token = await encrypt(req.user.toObject());
  req.user.token = token;
  res.cookie("auth", token, COOKIE_OPTS);
  next();
}

export async function extractTokenFromCookie(req, res, next) {
  const sCookie = req.signedCookies.auth;
  if (sCookie) {
    const tokenDecrypt = await decrypt(sCookie);
    req.user = tokenDecrypt;
  }
  next();
}
