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

/////////////////////////////

// CONECTAR DB
await connectDb();

//SERVER

const app = express();

app.get("/loggerTest", (req, res) => {
  logger.debug("LOGGER TEST DEBUG");
  logger.http("LOGGER TEST HTTP");
  logger.info("LOGGER TEST INFO");
  logger.warning("LOGGER TEST WARNING");
  logger.error("LOGGER TEST ERROR");
  logger.fatal("LOGGER TEST FATAL");
  return;
});
app.get("/mail", async (req, res) => {
  let result = await transport.sendMail({
    from: "Santiago Duré - Desarrollador web <santidure2002@gmail.com>",
    to: "santidure200@gmail.com",
    subject: "reestablece tu contraseña",
    html: `
    <div>
      
        <h1>presiona el boton para iniciar el proceso de reestablecimiento</h1>
        <a href='http://localhost:8080/resetpassword'>ir</a>
      
    </div>
    `,
    attachments: [],
  });
  res.send({ status: "success", result: "email sent" });
});
app.use(cookieParser(COOKIE_SECRET));
app.use(sesiones);
app.use(passportInitialize, passportSession);
app.engine("handlebars", handlebars.engine());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong!");
});
// logger.info(process.env);
app.use("/api", apiRouter);

const server = app.listen(PORT, () =>
  logger.info(`servidor levantado en el puerto ${PORT}`)
);

/////////////////////////////

//WEBSOCKET
const websocketServer = new Server(server);
app.use("/static", express.static("./static"));
app.use("/", webRouter);
websocketServer.on("connection", async (socket) => {
  logger.info(socket.id);
  //getProducts
  socket.emit("getProducts", await productService.getProductsService({}));

  //add
  socket.on(
    "addProduct",
    async ({ title, description, code, price, stock, category, thumbnail }) => {
      await productService.createProductService({
        title,
        description,
        code,
        price,
        stock,
        category,
        thumbnail,
      });
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
