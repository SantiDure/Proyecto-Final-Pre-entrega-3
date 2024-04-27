import { Server } from "socket.io";
import { ServerToUp } from "./app/app.js";
import { productService } from "./services/index.js";
import { messagesDaoMongoose } from "./dao/message.dao.mongoose.js";
import { gmailEmailService } from "./services/email.service.js";
const server = new ServerToUp();
server.connect();
await server.connectDb();

const websocketServer = new Server(server.server);

websocketServer.on("connection", async (socket) => {
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
  socket.on("disconnecting", () => {});
  //delete
  socket.on("deleteProduct", async (productID) => {
    const product = await productService.getProductByIdService(productID);
    if (product) {
      if (product.owner !== "admin") {
        await gmailEmailService.send(
          product.owner,
          "Producto eliminado",
          `Se eliminó tu producto "${product.title}"`
        );
      }

      await productService.deleteOneService(productID);
      websocketServer.emit(
        "getProducts",
        await productService.getProductsService({})
      );
    }
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
