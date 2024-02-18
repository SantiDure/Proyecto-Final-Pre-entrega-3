import { Router } from "express";
import { ProductsDaoMock } from "../../dao/mock/product.dao.mock.js";
export const mockingRouter = Router();
const daoMock = new ProductsDaoMock();
mockingRouter.get("/", async (req, res) => {
  const products = await daoMock.create();
  return res.send(products);
});
