import { hashSync, compareSync, genSaltSync } from "bcrypt";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/config.js";
export function hashear(password) {
  return hashSync(password, genSaltSync(10));
}

export function hashCompare(received, almacened) {
  return compareSync(received, almacened);
}

export async function encrypt(data) {
  return new Promise((resolve, reject) => {
    if (!data) {
      reject(new Error("no hay datos para encriptar"));
    }
    jwt.sign(data, JWT_SECRET, { expiresIn: "24h" }, (error, encoded) => {
      if (error) {
        reject(error);
      } else {
        resolve(encoded);
      }
    });
  });
}

export async function decrypt(token) {
  return new Promise((resolve, reject) => {
    if (!token) {
      reject(new Error("no hay token para desencriptar"));
    }
    jwt.verify(token, JWT_SECRET, (error, decoded) => {
      if (error) {
        reject(error);
      } else {
        resolve(decoded);
      }
    });
  });
}
