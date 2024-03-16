import { COOKIE_SECRET, PORT } from "../config/config.js";
import express from "express";
import handlebars from "express-handlebars";
import { sesiones } from "../middlewares/sesiones.js";
import {
  passportInitialize,
  passportSession,
} from "../middlewares/autenticaciones.js";
import cookieParser from "cookie-parser";
import { apiRouter } from "../routing/api/api.router.js";
import { webRouter } from "../routing/web/web.router.js";

export class ServerToUp {
  #server;

  constructor() {
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
    this.app.use((err, req, res, next) => {
      console.error(err.stack);
      res.status(500).send("Something went wrong!");
    });
    this.app.use("/api", apiRouter);
    this.app.use("/static", express.static("./static"));
    this.app.use("/", webRouter);
  }

  connect(port = PORT) {
    return new Promise((resolve, reject) => {
      this.#server = this.app.listen(port, () => {
        resolve(true);
      });
    });
  }

  disconnect() {
    return new Promise((resolve, reject) => {
      this.#server.close((err) => {
        if (err) return reject(err);
        resolve(true);
      });
    });
  }
}
