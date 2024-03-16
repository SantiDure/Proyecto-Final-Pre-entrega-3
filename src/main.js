import { COOKIE_SECRET, PORT } from "./config/config.js";
import express, { Router } from "express";
import handlebars from "express-handlebars";
import { apiRouter } from "./routing/api/api.router.js";
import { webRouter } from "./routing/web/web.router.js";
import { Server } from "socket.io";
import { connectDb } from "./dao/mongodb.js";
import { productService } from "./dao/mongodb.js";
import { sesiones } from "./middlewares/sesiones.js";
import {
  passportInitialize,
  passportSession,
} from "./middlewares/autenticaciones.js";
import cookieParser from "cookie-parser";
import { messagesDaoMongoose } from "./dao/message.dao.mongoose.js";
import { logger } from "./utils/logger.js";
import { transport } from "./utils/nodemailer.js";
import { ServerToUp } from "./app/app.js";

const server = new ServerToUp();
server.connect();
await connectDb();

//WEBSOCKET
const websocketServer = new Server(server);

websocketServer.on("connection", async (socket) => {
  logger.info(socket.id);
  //getProducts
  socket.emit("getProducts", await productService.getProductsService({}));

  //add
  socket.on(
    "addProduct",
    async (
      { title, description, code, price, stock, category, thumbnail },
      ownerId
    ) => {
      await productService.createProductService(
        {
          title,
          description,
          code,
          price,
          stock,
          category,
          thumbnail,
        },
        ownerId
      );
      websocketServer.emit(
        "getProducts",
        await productService.getProductsService({})
      );
    }
  );
  socket.on("disconnecting", () => {
    logger.info(socket.id + " se fue");
  });
  //delete
  socket.on("deleteProduct", async (productID) => {
    await productService.deleteOneService(productID);

    websocketServer.emit(
      "getProducts",
      await productService.getProductsService({})
    );
  });

  //getMessage
  socket.emit("getMessages", await messagesDaoMongoose.readMany({}));
  //addMessage
  socket.on("addMessage", async ({ nombreUsuario, emailUsuario, message }) => {
    await messagesDaoMongoose.create({
      user: nombreUsuario,
      emailUser: emailUsuario,
      content: message,
    });
    websocketServer.emit("getMessages", await messagesDaoMongoose.readMany({}));
  });
});
