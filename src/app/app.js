import { COOKIE_SECRET, MONGODB_CNX_STR, PORT } from "../config/config.js";
import express from "express";
import handlebars from "express-handlebars";
import { sesiones } from "../middlewares/sesiones.js";
import {
  passportInitialize,
  passportSession,
} from "../middlewares/autenticaciones.js";
import cookieParser from "cookie-parser";
import { apiRouter } from "../routing/api/api.router.js";
import mongoose from "mongoose";
import { webRouter } from "../routing/web/web.router.js";
import { logger } from "../utils/logger.js";
export class ServerToUp {
  server;

  constructor() {
    this.port = PORT;
    this.app = express();

    this.app.get("/loggerTest", (req, res) => {
      logger.debug("LOGGER TEST DEBUG");
      logger.http("LOGGER TEST HTTP");
      logger.info("LOGGER TEST INFO");
      logger.warning("LOGGER TEST WARNING");
      logger.error("LOGGER TEST ERROR");
      logger.fatal("LOGGER TEST FATAL");
      return;
    });

    this.app.use(cookieParser(COOKIE_SECRET));
    this.app.use(sesiones);
    this.app.use(passportInitialize, passportSession);
    this.app.engine("handlebars", handlebars.engine());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use("/", webRouter);
    this.app.use("/api", apiRouter);
    this.app.use("/static", express.static("./static"));
    this.app.use((err, req, res, next) => {
      console.error(err.stack);
      res.status(500).send("Something went wrong!");
    });
  }

  connect() {
    return new Promise((resolve, reject) => {
      this.server = this.app.listen(this.port, () => {
        resolve(true);
      });
    });
  }

  disconnect() {
    return new Promise((resolve, reject) => {
      this.server.close((err) => {
        if (err) return reject(err);
        resolve(true);
      });
    });
  }
  async connectDb() {
    await mongoose.connect(MONGODB_CNX_STR, { socketTimeoutMS: 45_000 });
    return logger.info(`DB conectada`);
  }
}
