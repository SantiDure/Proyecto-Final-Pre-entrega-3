import session from "express-session";
import connectMongo from "connect-mongo";
import { MONGODB_CNX_STR } from "../config/config.js";

const store = connectMongo.create({
  mongoUrl: MONGODB_CNX_STR,
});

export const sesiones = session({
  store,
  secret: "secretDePrueba",
  resave: true,
  saveUninitialized: true,
  cookie: { maxAge: 60 * 60 * 1000 },
});
