import mongoose from "mongoose";
import { MONGODB_CNX_STR } from "../config/config.js";
import { logger } from "../utils/logger.js";

export function connectDb() {
  mongoose.connect(MONGODB_CNX_STR);
  return logger.info(`DB conectada`);
}

export { productService, cartService } from "../services/index.js";
