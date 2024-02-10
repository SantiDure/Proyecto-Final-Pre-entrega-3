import { Router } from "express";
import { productRouter } from "./product.router.js";
import { cartRouter } from "./cart.router.js";
import { messageRouter } from "./message.router.js";
import { sessionRouter } from "./sessions.router.js";
import { usersRouter } from "./users.router.js";

export const apiRouter = Router();

apiRouter.use("/products", productRouter);
apiRouter.use("/carts", cartRouter);
apiRouter.use("/messages", messageRouter);
apiRouter.use("/sessions", sessionRouter);
apiRouter.use("/users", usersRouter);
apiRouter.use((error, req, res, next) => {
  res.status(401).json({
    status: "error",
    message: error.message,
  });
});
