import mongoose from "mongoose";
import { MONGODB_CNX_STR } from "../config/config.js";
import { logger } from "../utils/logger.js";

export async function connectDb() {
  await mongoose.connect(MONGODB_CNX_STR, { socketTimeoutMS: 45_000 });
  return logger.info(`DB conectada`);
}
export async function disconnectDb() {
  await mongoose.disconnect();
  return logger.info(`DB desconectada`);
}

export { productService, cartService } from "../services/index.js";
