import { CartDaoMongoose } from "../dao/cart.dao.mongoose.js";
import { ProductsDaoMongoose } from "../dao/product.dao.mongoose.js";
import { TicketDaoMongoose } from "../dao/ticket.dao.mogoose.js";
import { UsersDaoMongoose } from "../dao/user.dao.mongoose.js";
import { CartRepository } from "./cart.service.js";
import { ProductRepository } from "./product.service.js";
import { TicketRepository } from "./ticket.service.js";
import { UserRepository } from "./user.service.js";
export const userService = new UserRepository(new UsersDaoMongoose());

export const productService = new ProductRepository(new ProductsDaoMongoose());
export const cartService = new CartRepository(new CartDaoMongoose());
export const ticketService = new TicketRepository(new TicketDaoMongoose());
