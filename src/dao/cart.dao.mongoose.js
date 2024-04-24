import { Schema, model } from "mongoose";
import { randomUUID } from "node:crypto";
import { ErrorType, newError } from "../errors/errors.js";
import { logger } from "../utils/logger.js";
import { productsManager } from "./product.dao.mongoose.js";
const cartSchema = new Schema(
  {
    _id: { type: String, default: randomUUID },
    products: [
      {
        _id: { type: String, ref: "products" },
        quantity: { type: Number, default: 0 },
      },
    ],
  },
  {
    strict: "throw",
    versionKey: false,
    statics: {
      addProductToCart: async function (cid, pid) {
        const initialQuantity = 1;

        const cart = await model("carts", cartSchema).findById(cid);

        const product = await productsManager.findById({
          _id: pid,
        });

        const productIndexFind = cart.products.findIndex(
          (p) => p._id === product._id
        );

        if (productIndexFind === -1) {
          await model("carts", cartSchema).findOneAndUpdate(
            { _id: cid },
            {
              $addToSet: {
                products: { _id: product._id, quantity: initialQuantity },
              },
            }
          );
        } else {
          await model("carts", cartSchema).findOneAndUpdate(
            { _id: cid, "products._id": product._id },
            {
              $inc: {
                "products.$.quantity": initialQuantity,
              },
            }
          );
        }
      },
      deleteProductOnCart: async function (cid, pid) {
        try {
          const cart = await model("carts", cartSchema).findById(cid);

          const product = await productsManager.findById({
            _id: pid,
          });

          const productIndexFind = cart.products.findIndex(
            (p) => p._id === product._id
          );
          if (productIndexFind !== -1) {
            cart.products.splice(productIndexFind, 1);

            await cart.save();

            return cart;
          } else {
            throw newError(
              ErrorType.NOT_FOUND,
              "producto no encontrado en el carrito"
            );
          }
        } catch (error) {
          logger.info(error);
        }
      },
      updateProductQuantityOnCart: async function (cid, pid) {},
    },
  }
);

cartSchema.pre("find", function (next) {
  this.populate("products._id");
  next();
});

export const cartsManager = model("carts", cartSchema);

export class CartDaoMongoose {
  async create(data) {
    const cart = await cartsManager.create(data);
    return cart;
  }
  async readOne(id) {
    const cart = await cartsManager.findOne({ _id: id });
    return cart;
  }
  async readMany(query) {
    return await cartsManager.find(query);
  }
  async updateOne(id, data) {
    return await cartsManager.findOneAndUpdate(
      { _id: id },
      { $set: data },
      { new: true }
    );
  }

  async deleteOne(id) {
    return await cartsManager.findOneAndDelete({ _id: id }).toObject();
  }
  async deleteMany(query) {
    return await cartsManager.deleteMany(query);
  }
}
