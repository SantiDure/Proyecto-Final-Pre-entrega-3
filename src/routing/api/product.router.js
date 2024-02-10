import {
  getProductController,
  getProductControllerId,
  postProductController,
  putProductController,
  deleteProductController,
} from "../../controllers/product.controller.js";
import { Router } from "express";
export const productRouter = Router();
productRouter.get("/", getProductController);
productRouter.get("/:pid", getProductControllerId);
productRouter.post("/", postProductController);
productRouter.put("/:pid", putProductController);
productRouter.delete("/:pid", deleteProductController);
