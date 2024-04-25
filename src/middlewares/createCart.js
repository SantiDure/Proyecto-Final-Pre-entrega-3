import { cartService } from "../services/index.js";
import { logger } from "../utils/logger.js";

export async function createCart(req, res, next) {
  req.body.cart = await cartService.createCartService();
  if (req.body.cart == null) {
    return logger.error("no se pudo crear el cart al registrar un usuario");
  } else {
    next();
  }
}
