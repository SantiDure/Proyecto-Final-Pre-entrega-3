import nodemailer from "nodemailer";
import { EMAIL, EMAIL_PASS } from "../config/config.js";
export const transport = nodemailer.createTransport({
  service: "gmail",
  port: 582,
  secure: false,
  auth: {
    user: EMAIL,
    pass: EMAIL_PASS,
  },
});
