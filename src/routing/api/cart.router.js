import {
  getCartByIdController,
  postCartController,
  postAddProductToCartController,
  getCartsController,
  deleteCartController,
  deleteProductOnCartController,
  updateCartController,
  updateProductQuantityOnCartController,
  getTicketController,
  deleteManyCartController,
} from "../../controllers/carts.controller.js";
import { Router } from "express";
import { onlyUserAndPremium } from "../../middlewares/autorizaciones.js";
export const cartRouter = Router();
cartRouter.get("/:cid", onlyUserAndPremium, getCartByIdController);
cartRouter.get("/", getCartsController);
cartRouter.get("/:cid/purchase", getTicketController);
cartRouter.post("/", postCartController);
cartRouter.post("/:cid/product/:pid", postAddProductToCartController);
cartRouter.put("/:cid", updateCartController);
cartRouter.put("/:cid/products/:pid", updateProductQuantityOnCartController);
cartRouter.delete("/:cid", deleteCartController);
cartRouter.delete("/", deleteManyCartController);
cartRouter.delete("/:cid/products/:pid", deleteProductOnCartController);
