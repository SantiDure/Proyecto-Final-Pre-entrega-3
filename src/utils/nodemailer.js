import nodemailer from "nodemailer";

export const transport = nodemailer.createTransport({
  service: "gmail",
  port: 582,
  secure: false,
  auth: {
    user: "santidure2002@gmail.com",
    pass: "wuxb ndat sgxr sdfi",
  },
});
