import mongoose from "mongoose";
import { randomUUID } from "node:crypto";
import { hashCompare } from "../utils/criptograph.js";
import { generateUniqueUsername } from "../utils/randomUserName.js";
import { cartService } from "../services/index.js";
import { newError, ErrorType } from "../errors/errors.js";
const collection = "users";
const userSchema = new mongoose.Schema(
  {
    _id: { type: String, default: randomUUID },
    email: { type: String, unique: true },
    password: { type: String, default: "" },
    first_name: { type: String, default: generateUniqueUsername },
    last_name: { type: String, default: "unknow" },
    age: { type: Number, default: 0 },
    cart: { type: Object, required: true },
    rol: { type: String, enum: ["admin", "user", "premium"], default: "user" },
  },
  {
    strict: "throw",
    versionKey: false,
    statics: {
      login: async function (email, password) {
        let datosUsuario;

        if (email === "admin@coder.com" && password === "admin") {
          datosUsuario = {
            email: "admin",
            first_name: "admin",
            last_name: "admin",
            rol: "admin",
          };
        } else {
          const user = await mongoose
            .model(collection)
            .findOne({ email })
            .lean();

          if (!user) {
            throw newError(ErrorType.BAD_REQUEST, "login failed");
          }

          if (!hashCompare(password, user["password"])) {
            throw newError(ErrorType.UNAUTHORIZED, "login failed");
          }

          datosUsuario = {
            _id: user["_id"],
            email: user["email"],
            first_name: user["first_name"],
            last_name: user["last_name"],
            password: user["password"],
            age: user["age"],
            cart: user["cart"],
            rol: user["rol"],
          };
        }
        return datosUsuario;
      },
    },
  }
);

export const usersManager = mongoose.model(collection, userSchema);

export class UsersDaoMongoose {
  async create(data) {
    const cartToNewUser = await cartService.createCartService();
    data.cart = cartToNewUser;
    const user = await usersManager.create(data);

    return user.toObject();
  }
  async readOne(query) {
    return await usersManager.findOne(query).lean();
  }
  async readMany(query) {
    return await usersManager.find(query).lean();
  }
  async updateOne(id, query) {
    return await usersManager
      .findOneAndUpdate({ _id: id }, query, { new: true })
      .lean();
  }

  async deleteOne(id) {
    return await usersManager.findOneAndDelete({ _id: id }).lean();
  }
}
