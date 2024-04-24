import { Schema, model } from "mongoose";
import { randomUUID } from "node:crypto";
import mongoosePaginate from "mongoose-paginate-v2";
const productSchema = new Schema(
  {
    _id: { type: String, default: randomUUID },
    title: { type: String, require: true },
    description: {
      type: String,
      default: "El vendedor no proporciono una descripcion del producto",
    },
    code: { type: String, require: true, unique: true },
    price: { type: Number, require: true },
    status: { type: Boolean, default: true },
    stock: { type: Number, default: 0 },
    category: { type: String, default: "Otros" },
    thumbnail: { type: [String], default: [] },
    owner: { type: String, default: "admin" },
  },
  {
    strict: "throw",
    versionKey: false,
  }
);

productSchema.plugin(mongoosePaginate);

export const productsManager = model("products", productSchema);

export class ProductsDaoMongoose {
  async create(data, ownerId) {
    const product = await productsManager.create(data);
    const productWithOwner = await productsManager.findOneAndUpdate(
      { _id: product._id },
      { $set: { owner: ownerId } },
      { new: true }
    );
    return productWithOwner;
  }
  async readOne(pid) {
    const product = await productsManager.findOne({ _id: pid });
    return product.toObject();
  }
  async readMany(query) {
    const products = await productsManager.find(query);
    return products;
  }
  async updateOne(id, data) {
    return await productsManager.findOneAndUpdate(
      { _id: id },
      { $set: data },
      { new: true }
    );
  }

  async deleteOne(id) {
    const productToDelete = await productsManager.findOneAndDelete({ _id: id });

    return productToDelete;
  }
}
